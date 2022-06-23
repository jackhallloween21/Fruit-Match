window.onload=function(){
var scores = 0;
var WIDTH=7,LENGTH=WIDTH*WIDTH

,cols=[

"&nbsp;",

"🍓",

"🍇",

"🍎",

"🍒",

"🍍",

"🍉",

"🍌"

],

NUM_COLS=cols.length-1,

selected=-1,

stuff=new Array(LENGTH)

game.innerHTML=(new Array(LENGTH+1)).join("<div>x</div>")

tiles=game.getElementsByTagName("div")

game.style.width=WIDTH*2+"em"

CELL_WIDTH=tiles[0].clientWidth

function transition(s,t,f,e){

    var a=2

    return function(){

        a++;

f(s+=a)

        if(s<=t)setTimeout(arguments.callee,20)

        else{f(t);if(typeof e==="function")e()}

    }

}

for(var i=0;i<LENGTH;i++){

    stuff[i]=~~(Math.random()*NUM_COLS)+1

}

game.onclick=function(e){

    click(_n(

        ~~((e.pageX-game.offsetLeft)/CELL_WIDTH),

        ~~((e.pageY-game.offsetTop)/CELL_WIDTH)

        ))

}

function create_temp(x,y,v){

    var t=y*CELL_WIDTH,l=x*CELL_WIDTH,i=_n(x,y)

    temp=document.createElement("div")

    temp.innerHTML=cols[v]

    temp.style.position="absolute"

    temp.style.top=t+"px"

    temp.style.left=l+"px"

    if(i>-1) tiles[i].innerHTML="&nbsp;"

    game.appendChild(temp)

    temp.remove=function(){

        game.removeChild(this)

    }

    return temp

}

function falling(x,sy,ey,col){

    var i=_n(x,sy)

    var t=sy*CELL_WIDTH,l=x*CELL_WIDTH,et=ey*CELL_WIDTH,

    temp=create_temp(x,sy,col)

    transition(t,et,

        function(d){

            temp.style.top=d+"px"

        },

        function(){

            temp.remove()

            tiles[_n(x,ey)].innerHTML=cols[col]

        })()



}

function explode(i,v){

    var t=_y(i)*CELL_WIDTH,l=_x(i)*CELL_WIDTH

    var temp=create_temp(_x(i),_y(i),v)

    transition(0,50,

        function(d){

            //temp.style.top=t+d+"px"

            temp.style.opacity=1-d/50

        },

        function(){

            temp.remove()

        })()

}

function refresh(){

    for(var i=0;i<LENGTH;i++){

        tiles[i].innerHTML=cols[stuff[i]]

    }

    //out.innerHTML=stuff.join("<br/>")

}

function isNear(i,j)    {return i%WIDTH!=WIDTH-1&&i+1==j||i%WIDTH!=0&&i-1==j||i-WIDTH==j||i+WIDTH==j}

function _x(i)            {return i%WIDTH;}

function _y(i)            {return ~~(i/WIDTH);}

function _n(x,y)        {return y*WIDTH+x}

function swap(i,j,undo){

    var

    gem1=create_temp(_x(i),_y(i),stuff[i]),

    gem2=create_temp(_x(j),_y(j),stuff[j])



    transition(0,CELL_WIDTH,

        function(d){

            gem1.style.left=_x(i)*CELL_WIDTH+(_x(j)-_x(i))*d+"px"

            gem2.style.left=_x(j)*CELL_WIDTH+(_x(i)-_x(j))*d+"px"

            gem2.style.top=_y(j)*CELL_WIDTH+(_y(i)-_y(j))*d+"px"

            gem2.style.top=_y(j)*CELL_WIDTH+(_y(i)-_y(j))*d+"px"

        },

        function(){

            gem1.remove()

            gem2.remove()

            if( !undo && !checkAll()){

                swap(i,selected,1)

            } else {

                refresh()

            }

                unselect()

        })()



    var temp=stuff[i];

    stuff[i]=stuff[j];

    stuff[j]=temp



}

function check(i){

    var row=[],col=[],ret=[i],val=stuff[i],x

    for(x=i;x>-1&&_y(i)==_y(x)&&stuff[x]==val;x--)    {if(x!=i)row.push(x)}

    for(x=i;_y(i)==_y(x)&&stuff[x]==val;x++)        {if(x!=i)row.push(x)}

    for(x=i;x>=0&&stuff[x]==val;x-=WIDTH)            {if(x!=i)col.push(x)}

    for(x=i;x<=LENGTH&&stuff[x]==val;x+=WIDTH)        {if(x!=i)col.push(x)}

    if(row.length>1)ret=ret.concat(row)

    if(col.length>1)ret=ret.concat(col)

    return ret

}

function clear(ar,init,temp){

    if(ar.length>1){
 scores += 100;  // Added these two lines
    document.getElementById("scores").innerHTML = scores;
        while(temp=ar.pop()){

            if(!init) explode(temp,stuff[temp])

            stuff[temp]=0

        }

        if(!init) setTimeout(fall,300); else fall(init)

        return true

    }

}

function checkAll(init){

    for(var i=0,f=false,cl=[],temp;i<LENGTH;i++){

        temp=check(i)

        if(temp.length>1){

            cl=cl.concat(temp)

            f=true

        }

    }

    if(f) clear(cl,init)

    return f

}

function unselect(){tiles[selected].className="";selected=-1}

function select(i){selected=i;tiles[i].className="selected"}

function click(i){

    refresh()

    if(selected==-1){

       select(i);


    } else if(isNear(selected,i)){

        swap(i,selected)



    } else unselect();

}



function fall(init){

var flag=false,above=1,toFall=[]

    for(var x=0;x<WIDTH;x++){

        var empty=-1

        for(var y=WIDTH-1;y>=0;y--){

            if(empty!=-1){

                if(stuff[_n(x,y)]>0){

                    flag=true

                    stuff[_n(x,empty)]=stuff[_n(x,y)]

                    if(!init) toFall.push([x,y,empty,stuff[_n(x,y)]])

                    stuff[_n(x,y)]=0

                    empty--;

                }

            } else if(stuff[_n(x,y)]==0) empty=y;

        }

        while(empty>-1){

            stuff[_n(x,empty)]=~~(Math.random()*NUM_COLS)+1

            if(!init) toFall.push([x,-above,empty,stuff[_n(x,empty)]])

            empty--;above++

        }

    }

while(f=toFall.pop()){falling(f[0],f[1],f[2],f[3])}

if(init){checkAll(init)} else{setTimeout(checkAll,300)}

return flag

}

while(fall(true));refresh()



}
