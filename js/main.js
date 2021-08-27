
const VSGenerator = (() => {
    'use strict';
    var canvas,
        ctx,
        height,
        width,
        middleH,
        middleW,
        images = [],
        imageIndex = 0,
        canvasOffset,
        offsetX,
        offsetY,
        startDragging = false,
        isDragging = false,
        mouse = { x: 0, y: 0 };

    const _drawCanvas = () => {
        // clear();
        _drawImages();
        _drawFrame();
        _drawNames();
        _checkInputs();
    }

    const _drawFrame = () => {

        var frameWidth = 10;
        var radio = 30;
        ctx.fillStyle = '#0b0b0b';
        ctx.fillRect(0, 0, width, frameWidth);
        ctx.fillRect(0, 0, frameWidth, height);
        ctx.fillRect(width - frameWidth, 0, frameWidth, height);
        ctx.fillRect(0, height - frameWidth, width, frameWidth);
        ctx.fillRect((middleW) - (frameWidth / 2), 0, frameWidth, height);
        ctx.beginPath();
        ctx.arc(middleW, middleH, radio, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "#FFFFFF";
        ctx.font = '36px Bebas';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle'
        ctx.fillText('VS', middleW, middleH + 5);
        _checkInputs();
    }

    const clear = () => {
        ctx.clearRect(0, 0, width, height);
        images = [];
        _drawFrame();
        _clearInputs();
        _checkInputs();
    }

    var download = () => {
        let link = document.createElement('a');
        link.setAttribute('href', canvas.toDataURL());
        link.setAttribute('download', 'download.jpg');
        document.body.appendChild(link);
        link.click();
        link.remove();
        download = false;
    }

    function Picture(img, x, y) {
        var scale,
            middleX,
            middleY;

        this.x = x;
        this.y = y;
        this.isDragging = false;

        if (img.height > img.width) {
            scale = Math.max((width / 2) / img.width, height / img.height);
            middleX = x;
        } else if (img.width > img.height) {
            middleX = x - (img.width / 4);
            scale = Math.max(width / img.width, height / img.height);
        } else {
            scale = 1;
            middleX = x;
        }

        // get the top left position of the image
        // var x = (width / 2) - (img.width / 2) * scale;
        var middleY = (height / 2) - (img.height / 2) * scale;
        // get the scale

        this.draw = () => {

            if (!isDragging) {
                ctx.save();

                ctx.beginPath();
                ctx.moveTo(this.x, 0);
                ctx.lineTo(this.x, height);
                ctx.lineTo((this.x + width / 2), height);
                ctx.lineTo((this.x + width / 2), 0);
                ctx.closePath();
                ctx.clip();

                ctx.drawImage(img, middleX, middleY, img.width * scale, img.height * scale);

                ctx.restore();
            } else {
                ctx.save();

                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.lineTo((x + width / 2), height);
                ctx.lineTo((x + width / 2), 0);
                ctx.closePath();
                ctx.clip();

                ctx.drawImage(img, this.x, this.y, img.width * scale, img.height * scale);

                ctx.restore();
            }
        }
    }

    const _newImage = (img, id, x, y) => {
        images.push({
            id: id,
            image: new Picture(img, x, y)
        });
        // imageIndex++;
    }

    const _addImage = (e, xPosition, id) => {

        e.preventDefault();
        var url = URL.createObjectURL(e.target.files[0]);
        var img = new Image();
        img.src = url;

        img.onload = () => {
            _newImage(img, id, xPosition, 0);
            _drawCanvas();
        }
    }

    const drawLeft = (e) => {
        const xPosition = 0;
        _addImage(e, xPosition, 0);
    }

    const drawRight = (e) => {
        const xPosition = width / 2;
        _addImage(e, xPosition, 1);
    }

    const _drawImages = () => {
        for (let i = 0; i < images.length; i++) {
            images[i].image.draw();
        }
    }

    const _drawNames = (text, x, y) => {
        let long = 350;
        let mask = 15;

        ctx.save();
        ctx.fillStyle = "#0b0b0b";
        ctx.fillRect(x, height - 110, long, 70);
        ctx.beginPath();
        ctx.moveTo(x + mask, height - 110);
        ctx.lineTo(x + mask, height - 70);
        ctx.lineTo(x + (long - mask), height + 70);
        ctx.lineTo(x + (long - mask), height - 110);
        ctx.closePath();
        ctx.clip();
        ctx.fillStyle = "#FFFFFF";
        ctx.textAlign = 'left';
        ctx.font = '32px Bebas';
        ctx.fillText(text, x + 20, height - 75);
        ctx.restore();
    }

    const nameLeft = (e) => {
        var text = e.target.value;
        var textPos = [40, height - 75];

        _drawNames(text, ...textPos)
    }

    const nameRight = (e) => {
        var text = e.target.value;
        var textPos = [middleW + 40, height - 75];

        _drawNames(text, ...textPos)
    }

    const _clearInputs = () => {
        var inputFiles = document.querySelectorAll('input');
        inputFiles.forEach(input => {
            input.value = '';
            input.placeholder = '';
        });
    }

    const _checkInputs = () => {
        var inputFiles = document.querySelectorAll('input[type="file"]');
        inputFiles.forEach(input => {
            var id = input.getAttribute('id');
            var label = document.querySelector(`label[for="${id}"]`);
            var col = label.closest('.col');
            if (input.value != '') {
                label.classList.add('d-none');
                col.classList.add('hide');
            } else {
                label.classList.remove('d-none');
                col.classList.remove('hide');
            }
        });
    }

    /* function _handleMouseDown(e) {
        let canMouseX = parseInt(e.clientX - offsetX);
        let canMouseY = parseInt(e.clientY - offsetY);
        // set the drag flag
        isDragging = true;
        console.log('dragging!');
    }

    function _handleMouseUp(e) {
        let canMouseX = parseInt(e.clientX - offsetX);
        let canMouseY = parseInt(e.clientY - offsetY);
        // clear the drag flag
        isDragging = false;
    }

    function _handleMouseOut(e) {
        let canMouseX = parseInt(e.clientX - offsetX);
        let canMouseY = parseInt(e.clientY - offsetY);
        // user has left the canvas, so clear the drag flag
        //isDragging=false;
    }

    function _handleMouseMove(e) {
        let canMouseX = parseInt(e.clientX - offsetX);
        let canMouseY = parseInt(e.clientY - offsetY);
        // if the drag flag is set, clear the canvas and draw the image
        if (isDragging) {
            // ctx.clearRect(0, 0, width, height);
            if (images.length > 0) {
                ctx.drawImage(images[0].x, canMouseX - 128 / 2, canMouseY - 120 / 2, 128, 120);
            }
        }
    } */

    var _initEvent = (e) => {
        e.preventDefault();
        e.stopPropagation();

        mouse.x = e.layerX;
        mouse.y = e.layerY;
    }

    const _clickImage = (e) => {
        console.log('click');
    }

    const _startDrag = (e) => {
        /* TODO */
        var circle,
            i,
            j;

        _initEvent(e);

        // Test each image to see if mouse is in it
        isDragging = false;

        /* for (let i = 0; i < images.length; i++) {
            image = images[i].image;

            if (_isImage(image, mouse, width, height)) {
                image = images[i].image;
                target = images[i].id;
                startDragging = true;
                startX = mouse.x;
                startY = mouse.y;
            }
        } */
    }

    const _moveImage = (e) => {
        /* TODO */
        // var slide,
        //     circle,
        //     circle2,
        //     i,
        //     j,
        //     k,
        //     dx,
        //     dy;

        // _initEvent(e);

        // if (startDragging && (Math.abs(mouse.x - startX) > 20 || (Math.abs(mouse.y - startY) > 20))) {

        //     isDragging = true;
        //     startDragging = false;
        //     slide = _getSlideById(startSlide);
        //     slide.circle.isDragging = true;
        // }

        // if (isDragging) {
        //     // calculate the distance the mouse has moved
        //     // since the last mousemove
        //     dx = mouse.x - startX;
        //     dy = mouse.y - startY;

        //     // move each circle that isDragging
        //     // by the distance the mouse has moved
        //     // since the last mousemove
        //     for (i = 0; i < slides.length; i++) {
        //         circle = slides[i].circle;

        //         if (circle.isDragging) {
        //             if (circle.isActive) {
        //                 circle.slice.x += dx;
        //                 circle.slice.y += dy;

        //                 // Active circle for not direct relations
        //                 for (j = 0; j < slides.length; j++) {
        //                     circle2 = slides[j].circle;
        //                     circle2.isActive = true;

        //                     if (_isCircle(circle2, mouse, radius)) {
        //                         endSlide = slides[j].id;

        //                         for (k = 0; k < circle2.slices.length; k++) {
        //                             if (_isSlice(circle2, mouse, circle2.slices[k]) && !circle2.slices[k].isDisabled) {
        //                                 endSlice = k;
        //                             }
        //                         }
        //                     }
        //                 }
        //             } else {
        //                 slides[i].circle.x += dx;
        //                 slides[i].circle.y += dy;
        //             }

        //             break;
        //         }
        //     }

        //     // Reset the starting mouse position for the next mousemove
        //     startX = mouse.x;
        //     startY = mouse.y;

        //     // Draw canvas
        //     _drawCanvas();
        // }
    }

    const _endDrag = (e) => {
        /* TODO */
        // var slide,
        //     circle,
        //     i,
        //     j;

        // _initEvent(e);

        // // Create a not direct relation
        // if (startSlide !== null && endSlide !== null && startSlide !== endSlide) {
        //     slide = _getSlideById(endSlide);
        //     circle = slide.circle;

        //     for (i = 0; i < circle.slices.length; i++) {
        //         if (_isSlice(circle, mouse, circle.slices[i]) && !circle.slices[i].isDisabled) {
        //             _newRelation(startSlide, endSlide, startSlice, endSlice);
        //             break;
        //         }
        //     }
        // }

        // // Clear all the dragging flags
        // for (i = 0; i < slides.length; i++) {
        //     circle = slides[i].circle;
        //     circle.isDragging = false;
        //     circle.slice = {};

        //     if (isDragging && slides[i].circle.isActive) {
        //         circle.isActive = _getSlideId(startSlide) === i;
        //     }

        //     for (j = 0; j < circle.slices.length; j++) {
        //         circle.slices[j].isHover = false;
        //     }
        // }

        // isDragging = false;
        // startDragging = false;
    }

    /* const _handlers = () => {
        canvas.addEventListener('click', function(){
            console.log('click');
        });
        canvas.addEventListener('mousedown', _handleMouseDown, false);
        canvas.addEventListener('mousemove', _handleMouseMove, false);
        canvas.addEventListener('mouseup', _handleMouseUp, false);
        canvas.addEventListener('mouseout', _handleMouseOut, false);
    } */

    const _attachEvents = () => {

        // canvas.addEventListener('click', _clickImage, false);
        canvas.addEventListener('mousedown', _startDrag, false);
        // canvas.addEventListener('mousemove', _moveImage, false);
        canvas.addEventListener('mouseup', _endDrag, false);
        window.addEventListener('resize', _drawCanvas, false);
    }

    const init = () => {
        canvas = document.querySelector('#canvas');
        if (canvas) {
            ctx = canvas.getContext('2d');
            height = canvas.height;
            width = canvas.width;
            middleH = height / 2;
            middleW = width / 2;

            /* canvasOffset = canvas.offset();
            offsetX=canvasOffset.left;
            offsetY=canvasOffset.top;
            isDragging=false; */
        }

        _drawCanvas();
        // _handlers();
        _attachEvents();
    }

    return {
        init,
        download,
        clear,
        drawLeft,
        drawRight,
        nameLeft,
        nameRight,
    }

})();

document.addEventListener('DOMContentLoaded', VSGenerator.init);