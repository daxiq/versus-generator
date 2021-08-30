
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
                col.classList.add('behind');
            } else {
                label.classList.remove('d-none');
                col.classList.remove('hide');
                col.classList.remove('behind');
            }
        });
    }

    var _initEvent = (e) => {
        e.preventDefault();
        e.stopPropagation();

        mouse.x = e.layerX;
        mouse.y = e.layerY;
    }

    const _clickImage = (e) => {
        var posX = e.clientX - 55;
        if ( posX < middleW ) {
            return 0;
        }
        return 1;
    }

    const _startDrag = (e) => {
        /* TODO */
        _initEvent(e);

        // Test each image to see if mouse is in it
        isDragging = true;
        startDragging = true;
    }

    const _moveImage = (e) => {
        /* TODO */
        var image,
            i,
            startX,
            startY,
            inicioX,
            movimientoX,
            dx,
            dy;

        _initEvent(e);

        i = _clickImage(e);
        
        
        image = images[i].image;
        image.isDragging = true;
        startX = image.x;
        startY = image.y;

        if (isDragging) {
            
            dx = mouse.x - startX;
            dy = mouse.y - startY;
            
            if (image.isDragging) {
                image.x += dx;
                image.y += dy;
            }
            
            startX = mouse.x;
            startY = mouse.y;

            // Draw canvas
            _drawCanvas();
        }
    }

    const _endDrag = (e) => {
        var image,
            i;

        _initEvent(e);

        // Clear all the dragging flags
        for (i = 0; i < images.length; i++) {
            image = images[i];
            image.isDragging = false;
        }

        isDragging = false;
        startDragging = false;
    }

    const _attachEvents = () => {

        canvas.addEventListener('mousedown', _startDrag, false);
        canvas.addEventListener('mousemove', _moveImage, false);
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