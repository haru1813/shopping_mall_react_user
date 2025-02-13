if (/Android|iPhone/i.test(navigator.userAgent)) {
    const pc = document.getElementById("root");
    pc.style.display = 'none';
}
else {
    const pc = document.getElementById("root");
    // eslint-disable-next-line no-restricted-globals
    pc.style.width = (screen.width + 0) + "px";
    pc.style.display = 'block';
}