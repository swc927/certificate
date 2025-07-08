let backgroundImg = null;
const outputDiv = document.getElementById("output");

document.getElementById("bgUpload").addEventListener("change", (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = (event) => {
    backgroundImg = new Image();
    backgroundImg.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

document.getElementById("generate").addEventListener("click", () => {
  const names = document
    .getElementById("names")
    .value.trim()
    .split("\n")
    .filter((n) => n);
  outputDiv.innerHTML = "";

  document.getElementById("pageCountDisplay").textContent = "";


  if (!backgroundImg) {
    alert("⚠️ Please upload a certificate background first.");
    return;
  }

  document.fonts.ready.then(() => {
    const selectedFont = document.getElementById("fontSelect").value;
    const fontSize = parseInt(document.getElementById("fontSizeRange").value);
    const yOffset = parseInt(document.getElementById("yOffsetRange").value);

    names.forEach((name) => {
      const canvas = document.createElement("canvas");

      const layout = document.querySelector(
        'input[name="layout"]:checked'
      ).value;
      if (layout === "portrait") {
        canvas.width = 2480;
        canvas.height = 3508;
      } else {
        canvas.width = 3508;
        canvas.height = 2480;
      }



      const ctx = canvas.getContext("2d");

      ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

      ctx.font = `bold ${fontSize}px ${selectedFont}`;
      ctx.fillStyle = "#000000";
      ctx.textAlign = "center";
      ctx.fillText(name.trim(), canvas.width / 2, canvas.height / 2 + yOffset);

      outputDiv.appendChild(canvas);

    });

      document.getElementById("pageCountDisplay").textContent = `Total Pages: ${names.length}`;

  });
});



document.getElementById("download").addEventListener("click", async () => {
  const { jsPDF } = window.jspdf;

  const layout = document.querySelector('input[name="layout"]:checked').value;
  const pdf = new jsPDF({
    orientation: layout,
    unit: "pt",
    format: "a4",
  });

  const canvases = outputDiv.querySelectorAll("canvas");
  if (canvases.length === 0) {
    alert("⚠️ No certificates to download. Please generate first.");
    return;
  }

  for (let i = 0; i < canvases.length; i++) {
    const canvas = canvases[i];
    const imgData = canvas.toDataURL("image/jpeg", 1.0);
    if (i !== 0) pdf.addPage();

    const width = layout === "portrait" ? 595.28 : 841.89;
    const height = layout === "portrait" ? 841.89 : 595.28;
    pdf.addImage(imgData, "JPEG", 0, 0, width, height);
  }

  pdf.save("certificates.pdf");
});

document.getElementById("fontSelect").addEventListener("change", () => {
  document.getElementById("generate").click();
});

document.getElementById("fontSizeRange").addEventListener("input", function () {
  document.getElementById("fontSizeDisplay").textContent = this.value;
  document.getElementById("generate").click();
});

document.getElementById("yOffsetRange").addEventListener("input", function () {
  document.getElementById("yOffsetDisplay").textContent = this.value;
  document.getElementById("generate").click();
});
