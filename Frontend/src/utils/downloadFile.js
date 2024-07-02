function downloadFile(url, fileName) {
  let link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", decodeURIComponent(fileName));
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default downloadFile;
