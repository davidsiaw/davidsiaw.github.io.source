

function Square(n,i,name,min,max)
{
    this.toString = function()
    {
        return "["+name+" Square]";
    }

    this.getN = function()
    {
        return n;
    }

    var color = "#fff"

    if (min !== undefined && max !== undefined)
    {
        try
        {
            var diff = max - min;
            var level = (n - min) / diff * 16;
            var gb = ("00" + Math.floor(255-n).toString(16)).substr(-2);
            color = "#ff"+gb+gb;
        }
        catch
        {}
    }

    this.render = function(context,x,y,c="#000")
    {
        var ssize = 100;
        context.fillStyle = color;
        context.fillRect(x,y,ssize,ssize);
        context.strokeStyle = c;
        context.lineWidth=3;
        context.strokeRect(x,y,ssize,ssize);

        var isize = ssize / 5;
        context.fillStyle = "#000";
        context.font=isize+"px Lato";
        var m = context.measureText(""+i).width;
        context.fillText(""+i,x+ssize/20,y+ssize/10+isize/2);

        var digits = (""+n).length;
        var nsize = ssize / 0.5 / (3+digits/1.5);

        context.fillStyle = "#000";
        context.font=nsize+"px Lato";
        var m = context.measureText(""+n);
        context.fillText(""+n,x+ssize/2-m.width/2,y+ssize/2+nsize/2.5);
    }

    return this;
}

function FloatingList(screenWidth, screenHeight)
{
    var anim_length = 1000; // ms
    var delay_between_targets = 0; // ms

    var animation_targets = [];

    var positions = {};
    var last_pop_time = 0; // last time we completed an animation
    var last_update_time = 0; //ms
    var arrow_positions = {};
    var current_message = "";

    var highlighted = null;

    var current_tag = undefined;

    this.setScreenRes = function(width, height)
    {
        screenWidth = width;
        screenHeight = height;
    }

    this.getCurrentTag = function()
    {
        return current_tag;
    }

    this.setSquares = function(sq, options={}, tag=undefined)
    {
        // push a new state
        animation_targets.push({
            arr: sq, 
            ride_top: (options.ride_top === undefined ? true : false), 
            arrows: options.arrows,
            arrow_colors: options.arrow_colors,
            message: options.message,
            tag: tag
        });

        if (options.highlight !== undefined)
        {
            highlighted = options.highlight;
        }
    }

    this.getSquares = function()
    {
        // return the final one
        return (animation_targets[animation_targets.length - 1] || {arr:[]}).arr;
    }

    function stepAnimation()
    {
        var centerx = screenWidth/2;
        var centery = screenHeight/2;
        var ssize = 100;

        var curr_time = (new Date()).getTime();
        var animation_time = curr_time-last_pop_time;

        if (animation_time < anim_length)
        {
            // in the middle of an animation
            // so advance animation progress

            for(var square in positions)
            {
                var pos = positions[square];
                pos.x = pos.start_x + (pos.target_x - pos.start_x) * Math.sin(animation_time / anim_length * Math.PI/2);
                pos.y = pos.start_y + (pos.target_y - pos.start_y) * Math.sin(animation_time / anim_length * Math.PI/2);

                if (pos.ride_top && pos.target_x != pos.start_x)
                {
                    pos.y -= pos.ride_top * (ssize * 1.1) * Math.sin(animation_time / anim_length * Math.PI);
                }
            }

            return;
        }

        for(var square in positions)
        {
            var pos = positions[square];
            pos.x = pos.target_x;
            pos.y = pos.target_y;
        }

        if (animation_time < anim_length + delay_between_targets)
        {
            return;
        }
        
        if (animation_targets.length > 0)
        {
            // more animations to do

            // 1. pop animation_targets
            var new_target_object = animation_targets.shift();
            var new_target = new_target_object.arr;

            // 2. calculate new positions
            var strand_count = new_target.length;

            var width = strand_count * ssize;
            var startx = centerx - width / 2;

            var new_positions = {}



            for(var idx in new_target)
            {
                var sq = new_target[idx];
                new_positions[sq] = {
                    sq: sq,
                    target_x: startx + idx * ssize, 
                    target_y: centery - ssize/2
                }

                if (positions[sq])
                {
                    new_positions[sq].start_x = positions[sq].target_x;
                    new_positions[sq].start_y = positions[sq].target_y;
                    if (new_target_object.ride_top)
                    {
                        new_positions[sq].ride_top = -1 + (idx % 2) * 2;   
                    }
                }
                else
                {
                    new_positions[sq].start_x = startx + idx * ssize;
                    new_positions[sq].start_y = -ssize/2;
                }

                new_positions[sq].x = new_positions[sq].start_x
                new_positions[sq].y = new_positions[sq].start_y
            }

            for (var sq in positions)
            {
                var pos = positions[sq];

                // for squares which will no longer be around
                if (!new_positions[sq])
                {
                    new_positions[sq] = {
                        sq: pos.sq,
                        x: pos.target_x,
                        y: pos.target_y,
                        start_x: pos.target_x,
                        start_y: pos.target_y,
                        target_x: pos.target_x,
                        target_y: screenHeight+ssize/2
                    }
                }
            }

            positions = new_positions

            var new_arrow_positions = {};

            for (var idx in new_target_object.arrows)
            {
                new_arrow_positions[idx] = {
                    x: startx + new_target_object.arrows[idx] * ssize + ssize*0.1,
                    y: screenHeight/2+ssize
                }

                if (new_target_object.arrow_colors)
                {
                    new_arrow_positions[idx].color = new_target_object.arrow_colors[idx];
                }
            }

            arrow_positions = new_arrow_positions;
            //console.log(arrow_positions);

            current_message = new_target_object.message;

            // 3. set last_pop_time
            last_pop_time = curr_time;

            // 4. set tag
            current_tag = new_target_object.tag
        }

        last_update_time = curr_time;
    }

    function drawArrow(context, x, y)
    {
        var ssize    = 100;
        var width    = ssize;
        var height   = ssize*0.8;
        var arrowW   = 0.7 * width;
        var arrowH   = 0.6 * height;
        var p1       = {y:y+width,                 x: x+(height-arrowH)/2};
        var p2       = {y:y-(width-arrowW)+width,  x: x+(height-arrowH)/2};
        var p3       = {y:y-(width-arrowW)+width,  x: x};
        var p4       = {y:y,                       x: x+height/2};
        var p5       = {y:y-(width-arrowW)+width,  x: x+height};
        var p6       = {y:y-(width-arrowW)+width,  x: x+height-((height-arrowH)/2)};
        var p7       = {y:y+width,                 x: x+height-((height-arrowH)/2)};
        context.beginPath();
        context.moveTo(p1.x, p1.y);
        context.lineTo(p2.x, p2.y); // end of main block
        context.lineTo(p3.x, p3.y); // topmost point     
        context.lineTo(p4.x, p4.y); // endpoint 
        context.lineTo(p5.x, p5.y); // bottommost point 
        context.lineTo(p6.x, p6.y); // end at bottom point 
        context.lineTo(p7.x, p7.y);
        context.closePath();
        context.fill();

    }

    this.render = function(context)
    {
        stepAnimation();

        var hsquare = null;

        for(var square in positions)
        {
            var pos = positions[square];
            var color = "#000"
            if (highlighted && pos.sq.toString() === highlighted.toString())
            {
                hsquare = pos;
            }
            //console.log(pos.sq.toString(), highlighted.toString(), color)
            pos.sq.render(context, pos.x, pos.y, color);
        }

        if(hsquare)
        {
            hsquare.sq.render(context, hsquare.x, hsquare.y, "#0ff");
        }

        for(var i in arrow_positions)
        {
            var pos = arrow_positions[i];
            context.fillStyle = pos.color || "#fff";
            drawArrow(context, pos.x, pos.y);
        }

        if (current_message)
        {
            //current_message
            var nsize = 100 / 1.5;
            context.fillStyle = "#fff";
            context.font=nsize+"px Lato";
            var m = context.measureText(current_message);
            context.fillText(current_message, screenWidth/2-m.width/2, 50+nsize);
        }

    }

    return this;
}

function ArrayPlayground(div)
{
    var nextbutton     = document.createElement("button");
    var prevbutton     = document.createElement("button");
    var shufflebutton  = document.createElement("button");
    var sortbutton     = document.createElement("button");
    var clearbutton    = document.createElement("button");
    var addbutton      = document.createElement("button");
    var addinput       = document.createElement("input");
    var delfrontbutton = document.createElement("button");
    var delbackbutton  = document.createElement("button");
    var canvas         = document.createElement("canvas");

    addinput.value = 1;

    var context = canvas.getContext("2d");

    var theArray = [];
    var theAlgorithm = function(arr){ return [] };
    var playlist = [];
    var itemcount = 1;
    var cursor = 0;

    var screenWidth = 1024;
    var screenHeight = 480;
    
    div.appendChild(nextbutton    );
    div.appendChild(prevbutton    );
    div.appendChild(shufflebutton );
    div.appendChild(sortbutton    );
    div.appendChild(clearbutton   );
    div.appendChild(addbutton     );
    div.appendChild(addinput      );
    div.appendChild(delfrontbutton);
    div.appendChild(delbackbutton );
    div.appendChild(canvas        );


    canvas.width = screenWidth;
    canvas.height = screenHeight;
    canvas.style.width = "100%";
    canvas.style.height = "auto";

    function setResolution(width=1024, height=480)
    {
        screenWidth = width;
        screenHeight = height;
        fl.setScreenRes(screenWidth, screenHeight);
        canvas.width = screenWidth;
        canvas.height = screenHeight;
    }

    var fl = new FloatingList(screenWidth, screenHeight);

    var lastUpdateTime = new Date();
    var interval = setInterval(function()
    {
        var timeBetween = new Date() - lastUpdateTime;
        if (timeBetween > 16)
        {
            // 200ms updates
            lastUpdateTime = new Date();

            context.fillStyle = "#000";
            context.fillRect(0, 0, screenWidth, screenHeight);

            //context.fillStyle = "#f00";
            //context.fillRect(0, 0, screenWidth/2, screenHeight/2);

            fl.render(context);

            context.fillStyle = "#00f";
            context.fillRect(
                screenWidth*0.1-8, 
                screenHeight*0.05-8,
                screenWidth*0.8+16,
                26);

            if (playlist.length)
            {
                context.fillStyle = "#0af";
                context.fillRect(
                    screenWidth*0.1-5,
                    screenHeight*0.05-5,
                    screenWidth*0.8*cursor/(playlist.length-1)+10,
                    20);

                context.fillStyle = "#0ff";
                context.fillRect(
                    screenWidth*0.1,
                    screenHeight*0.05,
                    screenWidth*0.8*fl.getCurrentTag()/(playlist.length-1),
                    10);
            }



        }

    }, 16)

    function adjustResolution()
    {            
        var horz_rez = 1024;
        var ssize = 100;
        var width = ssize * theArray.length;
        if (width > 1024)
        {
            var nextpower = Math.ceil(Math.log(width)/Math.log(2));
            horz_rez = Math.pow(2, nextpower);
        }

        if (horz_rez !== screenWidth)
        {
            setResolution(horz_rez, screenHeight);
        }

    }

    function refresh()
    {
        if (playlist.length > 0)
        {
            var options = Object.assign({}, playlist[cursor].options);
            if (cursor === 0)
            {
                options.ride_top = false;
            }
            fl.setSquares(playlist[cursor].arr, options, playlist[cursor].idx);
        }
        else
        {
            fl.setSquares([])
        }

        if (cursor === 0)
        {
            prevbutton.disabled = true;
        }
        else
        {
            prevbutton.disabled = false;   
        }

        adjustResolution();

    }

    this.setAlgorithm = function(algo)
    {
        theAlgorithm = function(arr) {
            var result = algo(arr);
            result = result.map(function(x,i)
            {
                Object.assign({}, x);
                x.idx = i;
                return x;
            });
            return result;
        }
        playlist = theAlgorithm(theArray);
        cursor = 0;
        refresh();
    }

    this.clearArray = function()
    {
        theArray = [];
        playlist = [];
        cursor = 0;
        itemcount = 1;
        refresh();
    }

    this.next = function()
    {
        cursor = (cursor + 1) % playlist.length;
        refresh();
    }

    this.prev = function()
    {
        if (cursor == 0)
        {
            cursor += playlist.length;
        }
        cursor = (cursor - 1) % playlist.length;
        refresh();
    }

    this.shuffle = function()
    {
        theArray = shuffle(theArray);
        playlist = theAlgorithm(theArray);
        cursor = 0;
        refresh();
    }

    this.sort = function()
    {
        theArray = theArray.sort(function(a,b){return a.getN() - b.getN();});
        playlist = theAlgorithm(theArray);
        cursor = 0;
        refresh();
    }

    this.shift = function()
    {
        theArray = theArray.slice();
        theArray.shift();
        playlist = theAlgorithm(theArray);
        cursor = 0;
        refresh();
    }

    this.backspace = function()
    {
        theArray = theArray.slice();
        theArray.pop();
        playlist = theAlgorithm(theArray);
        cursor = 0;
        refresh();
    }

    function isNormalInteger(str)
    {
        return parseInt(str) == str;
    }

    this.bulkadd = function(vals)
    {
        theArray = theArray.slice();

        vals.forEach(function(val)
        {
            if (isNormalInteger(val))
            {

                var nums = theArray.map(function(x){return x.getN();}).concat(val);
                theArray.push( new Square(val,itemcount,itemcount,Math.min(...nums),Math.max(...nums)) );

                itemcount += 1;
            }  
        });

        playlist = theAlgorithm(theArray);
        cursor = 0;
        refresh();   
    }

    this.add = function(val)
    {
        this.bulkadd([val])
    }

    nextbutton.innerText = "next";
    prevbutton.innerText = "prev";
    shufflebutton.innerText = "shuffle";
    sortbutton.innerText = "sort";
    clearbutton.innerText = "clear";
    addbutton.innerText = "add";
    delfrontbutton.innerText = "shift";
    delbackbutton.innerText = "backspace";

    nextbutton.onclick = this.next;
    prevbutton.onclick = this.prev;
    shufflebutton.onclick = this.shuffle;
    sortbutton.onclick = this.sort;
    clearbutton.onclick = this.clearArray;

    var that = this;
    addbutton.onclick = function()
    { 
        that.add(parseInt(addinput.value));
        addinput.value = parseInt(addinput.value) + 1;
    };

    delfrontbutton.onclick = this.shift;
    delbackbutton.onclick = this.backspace;


    return this;
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// algorithm demonstrator functions

function swap(arr, idx1, idx2, callback)
{
    var a = arr[idx2];
    arr[idx2] = arr[idx1];
    arr[idx1] = a;
    callback(arr.slice())
}

function select_pivot_and_put_at_end(arr, callback)
{
    if (arr.length < 3)
    {
        var s = arr.slice();
        callback(s, {highlight: null});
        return s;
    }

    // b < a < c
    // c < a < b

    // b < c < a
    // a < c < b

    // a < b < c
    // c < b < a

    var a = 0;
    var b = Math.floor(arr.length/2);
    var c = arr.length-1;

    var an = arr[a].getN();
    var bn = arr[b].getN();
    var cn = arr[c].getN();

    callback(arr.slice(), {arrows: [a,b], highlight: null, message: "Median of 3 pivot"});
    if (arr[b].getN() < arr[a].getN())
    {
        swap(arr, a, b, callback);
        callback(arr.slice())
    }
    callback(arr.slice(), {arrows: [a,c]});
    if (arr[c].getN() < arr[a].getN())
    {
        swap(arr, a, c, callback);
        callback(arr.slice())
    }
    callback(arr.slice(), {arrows: [b,c]});
    if (arr[b].getN() < arr[c].getN())
    {
        swap(arr, b, c, callback);
        callback(arr.slice())
    }

    return arr;
}

function partition_with_pivot_at_end(arr, callback)
{
    if (arr.length < 2)
    {
        return;
    }

    var i = 0;
    var j = arr.length-2;
    var pivot = arr[arr.length-1].getN();
    var highlight = arr[arr.length-1];

    callback(arr.slice(), {highlight: highlight, message: "The pivot is highlighted"});

    while(true)
    {
        
        while(arr.length-3 && arr[i].getN() < pivot)
        {
            callback(arr.slice(), {highlight: highlight, arrows: [i,j], arrow_colors: ["#ff0", "#f0f"]});
            i += 1;
        }

        while(arr[j].getN() >= pivot)
        {
            j -= 1;
            callback(arr.slice(), {highlight: highlight, arrows: [i,j], arrow_colors: ["#ff0", "#f0f"]});

            if (j==-1)
            {
                // pivot is smallest number
                swap(arr, 0, arr.length-1, callback)
                return arr;
            }
        }

        if (i>=j)
        {
            swap(arr, j+1, arr.length-1, callback)
            return arr;
        }

        swap(arr, i, j, callback)
    }
}
