const canvas = document.querySelector("canvas"),
toolBtns = document.querySelectorAll(".tool"),
fillColor = document.querySelector("#fill-color"),
sizeSlider = document.querySelector("#size-slider"),
colorBtns = document.querySelectorAll(".colors .option"),
colorPicker = document.querySelector("#color-picker"),
clearCanvas = document.querySelector(".clear-canvas"),
saveImg = document.querySelector(".save-img"),
ctx = canvas.getContext("2d");

let prevMouseX, prevMouseY, snapshot,
isDrawing = false;
selectedTool = "brush",
brushWidth = 5;
selectedColor = "#000";

const setCanvasBackground = () => { //for white background for download image.
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillstyle = selectedColor;
}

window.addEventListener("load", () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});

const drawRect = (e) => {
    if (!fillColor.checked){
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX-e.offsetX, prevMouseY-e.offsetY);
    }
    return ctx.fillRect(e.offsetX, e.offsetY, prevMouseX-e.offsetX, prevMouseY-e.offsetY);
}

const drawCircle = (e) => {
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
    ctx.beginPath(); // Start a new path for each circle
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
    fillColor.checked ? ctx.fill() : ctx.stroke();
    ctx.closePath(); // Close the path to prevent continuous drawing
}

const drawTriangle = (e) => {
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo(prevMouseX *2 - e.offsetX, e.offsetY);
    ctx.closePath();
    fillColor.checked ? ctx.fill() : ctx.stroke();
}

const startDraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;
    ctx.beginPath(); //creating new path to draw.
    ctx.lineWidth = brushWidth; //passing brush size as line width.
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

const drawing = (e) => {
    if(!isDrawing) return; // if isDrawing is false return from here.
    ctx.putImageData(snapshot, 0, 0);
    if(selectedTool === "brush" || selectedTool === "eraser"){
        ctx.strokeStyle = selectedTool ==="eraser" ? "#fff" : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY);//create line according to mouse pointer
        ctx.stroke(); //drawing or filling line with color.
    } else if (selectedTool === "rectangle"){
        drawRect(e);
    }
    else if (selectedTool === "circle"){
        drawCircle(e);
    }
    else if (selectedTool === "triangle"){
        drawTriangle(e);
    }
}

toolBtns.forEach(btn => {
    btn.style.cursor = "pointer"; 
    btn.addEventListener("click", () => {

        document.querySelector(".tool.active")?.classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
        console.log(selectedTool);
    });
});

sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value);

colorBtns.forEach(btn => {
    btn.style.cursor = "pointer"; 
    btn.addEventListener("click", () => {
        document.querySelector(".colors .selected")?.classList.remove("selected");
        btn.classList.add("selected");
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});

colorPicker.addEventListener("change" , ()=>{
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCanvasBackground();
});

saveImg.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = `${Date.now()}.jpg`;
    link.href = canvas.toDataURL();
    link.click();
});

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false);
