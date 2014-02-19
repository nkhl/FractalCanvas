//Renreding fractal
var height = 600,
    width = 600,
    maxIter = 40,
    maxValue = 30,
    epsilonX = 4/width,
    epsilonY = 4/height,
    offsetX = 0,
    offsetY = 0,
    zoomAmount = 2,

    c = document.getElementById('c'),
    ctx = c.getContext('2d');

//Set canvas size
c.width = width;
c.height = height;

//Complex number class
var ComplexNumber = function(real,imaginary)
{
    this.real = real;
    this.imaginary = imaginary; 
};

//Extending the class
ComplexNumber.prototype = {

    real: 0,
    imaginary: 0,

    toString: function()
    {
        return this.real + " + " + this.imaginary + "i";
    },

    add: function()
    {
        //Its a complex number object
        if(arguments.length == 1)
            return new ComplexNumber(this.real + arguments[0].real, this.imaginary + arguments[0].imaginary);
        //Real and imaginary parts specified seperately
        else
            return new ComplexNumber(this.real + arguments[0], this.imaginary + arguments[1]);
    },

    substract: function()
    {
        //Its a complex number object
        if(arguments.length == 1)
            return new ComplexNumber(this.real - arguments[0].real, this.imaginary - arguments[0].imaginary);
        //Real and imaginary parts specified seperately
        else
            return new ComplexNumber(this.real - arguments[0], this.imaginary - arguments[1]);
    },

    multiply: function()
    {
        //Its a complex number object
        if(arguments.length == 1)
            return new ComplexNumber(this.real * arguments[0].real - this.imaginary * arguments[0].imaginary, this.real * arguments[0].imaginary + this.imaginary * arguments[0].real);
        //Real and imaginary parts specified seperately
        else
            return new ComplexNumber(this.real * arguments[0] - this.imaginary * arguments[1], this.real * arguments[1] + this.imaginary * arguments[0]);
    },

    absolute: function()
    {
        return Math.sqrt(Math.pow(this.real,2) + Math.pow(this.imaginary,2));
    }
};

//Cool snippet from stackoverflow
function relMouseCoords(event){
    var totalOffsetX = 0,
        totalOffsetY = 0,
        canvasX = 0,
        canvasY = 0,
        currentElement = this;
    
    do
    {
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;

    } while(currentElement = currentElement.offsetParent)

    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;

    return {x:canvasX, y:canvasY}
}
HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;

//Clear the screen
function clear()
{
    ctx.fillStyle = "White"
    ctx.beginPath();
    ctx.rect(0,0,width,height);
    ctx.closePath();
    ctx.fill();
}

//Handle mouse clicks
function handleClick(e)
{
    //Get position
    var coords = c.relMouseCoords(e),
        x = coords.x,
        y = coords.y;


    //Set new origo to clicked position
    offsetX -= epsilonX*(width/2 - x);
    offsetY -= epsilonY*(height/2 - y);

    //Zoom in
    epsilonX = epsilonX/zoomAmount;
    epsilonY = epsilonY/zoomAmount;

    //Origo shifts again upon zooming
    offsetX += (width/2)*epsilonX;
    offsetY += (height/2)*epsilonY;

    clear();
    render();
    //ctx.fillStyle = "Black";
    //ctx.fillText("Click on "+x+","+y,200,100);
}

//Main
function render()
{
    var w = 0,
        h = 0,
        iterations,
        distance,
        squared = 0,
        constant = new ComplexNumber(0,0),
        value = new ComplexNumber(0,0);

    // Lets clear the screen
    clear();

    //Pixel in set will be black
    ctx.fillStyle = "Black";
    
    //Go trough every pixel and find out if they are in the set
    for(var h = 0; h < height; h++)
    {
        for(var w = 0; w < width; w++)
        {
            //Set constant value for this pixel
            constant.real = epsilonX*w-2+offsetX; 
            constant.imaginary = epsilonY*h-2+offsetY; 

            //Reset limits
            iterations = 0;
            value.real = 0;
            value.imaginary = 0;

            //Let's see if the function goes to infinity
            while(iterations < maxIter && value.absolute() < maxValue)
            {
                //Mandlebrot yey! z = z^2 + C
                value = value.multiply(value).add(constant);
                ++iterations;
            }

            //Is the pixel in the set?
            distance = value.absolute();
            if(-2 <= distance && distance <= 2)
            {
                ctx.fillStyle = "Black";
                ctx.beginPath();
                ctx.rect(w,h,1,1);
                ctx.closePath();
                ctx.fill();
            }
            //Nope
            else
            {
                //Colouring experiments
                
                //ctx.fillStyle = "rgba("+
                //                        Math.floor(value.real%255)+","+
                //                        Math.floor(value.imaginary%255)+","+
                //                        Math.floor(distance%255)+",1)"; 
                 
                ctx.fillStyle = "rgba("+
                                        Math.floor((value.real*value.real/(value.imaginary*value.imaginary + 1))%255)+","+
                                        Math.floor(iterations*iterations%255)+","+
                                        Math.floor(distance%255)+",1)"; 
 
                ctx.beginPath();
                ctx.rect(w,h,1,1);
                ctx.closePath();
                ctx.fill();
            }
        }
    }
}

//Add event listener for clicks
c.addEventListener("click", handleClick, false);

render();

