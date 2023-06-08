const dragArea = document.querySelector('.drag-area');

console.log(dragArea);
// when image file is in the drag area 

dragArea.addEventListener("drop", (event) => {
    event.preventDefault();
    file = event.dataTransfer.files[0];

    console.log(file);
});
