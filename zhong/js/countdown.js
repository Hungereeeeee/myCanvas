// var WINDOW_WIDTH=1024;
// var WINDOW_HEIGHT=600;
// var RADIUS=8;
// var MARGIN_TOP=60;
// var MARGIN_LEFT=30;

var date=new Date();

const endTime = new Date(date.getTime()+5400000);
var curShowTimeSeconds=0;

var balls=[];
const colors=['#33B5E5','#0099CC','#AA66CC','#99CC00','#669900','#FF8800','#FF4444']
window.onload=function(){

	//屏幕自适应
	WINDOW_WIDTH=document.body.clientWidth;
	WINDOW_HEIGHT=document.body.clientHeight;

	MARGIN_LEFT=Math.round(WINDOW_WIDTH/10);
	RADIUS=Math.round(WINDOW_WIDTH*4/5/108)-1;
	MARGIN_TOP=Math.round(WINDOW_HEIGHT/10);

	var canvas = document.getElementById('canvas');

	canvas.width=WINDOW_WIDTH;
	canvas.height=WINDOW_HEIGHT;

	var context=canvas.getContext('2d');

	curShowTimeSeconds=getCurrentShowTimeSeconds();
	//绘制函数
	setInterval(function(){
		render(context);
		update();
		// curShowTimeSeconds--;
	},50)
}
//获得毫秒数
function getCurrentShowTimeSeconds(){
	var curTime=new Date();
	var ret = endTime.getTime()-curTime.getTime();
	ret=Math.round(ret/1000)

	return ret>=0?ret:0;
}
//
function update(){


	var nextShowTimeSeconds = getCurrentShowTimeSeconds();

	var nextHours=parseInt(nextShowTimeSeconds/3600);
	var nextMinutes=parseInt((nextShowTimeSeconds-nextHours*3600)/60);
	var nextSeconds=nextShowTimeSeconds%60;


	var curHours=parseInt(curShowTimeSeconds/3600);
	var curMinutes=parseInt((curShowTimeSeconds-curHours*3600)/60);
	var curSeconds=curShowTimeSeconds%60;

	//通过当前时间比较对curShowTimeSeconds进行修改
	if(nextSeconds != curSeconds){
		//确定小时数字添加小球
		if(parseInt(curHours/10)!=parseInt(nextHours/10)){
			addBalls(MARGIN_LEFT+0,MARGIN_TOP,parseInt(curHours/10));
		}
		if(parseInt(curHours%10)!=parseInt(nextHours%10)){
			addBalls(MARGIN_LEFT+15*(RADIUS+1),MARGIN_TOP,parseInt(curHours%10));
		}
		//确定分钟数字添加小球
		if(parseInt(curMinutes/10)!=parseInt(nextMinutes/10)){
			addBalls(MARGIN_LEFT+39*(RADIUS+1),MARGIN_TOP,parseInt(curMinutes/10));
		}
		if(parseInt(curHours%10)!=parseInt(nextHours%10)){
			addBalls(MARGIN_LEFT+54*(RADIUS+1),MARGIN_TOP,parseInt(curMinutes%10));
		}
		//确定秒数字添加小球
		if(parseInt(curSeconds/10)!=parseInt(nextSeconds/10)){
			addBalls(MARGIN_LEFT+78*(RADIUS+1),MARGIN_TOP,parseInt(curSeconds/10));
		}
		if(parseInt(curSeconds%10)!=parseInt(nextSeconds%10)){
			addBalls(MARGIN_LEFT+93*(RADIUS+1),MARGIN_TOP,parseInt(curSeconds%10));
		}

		curShowTimeSeconds=nextShowTimeSeconds;
	}

	upDateBalls();
}

//更新小球数据
function upDateBalls(){

	console.log(typeof balls)
	for( var i = 0 ; i < balls.length ; i ++ ){

       balls[i].x += balls[i].vx;
       balls[i].y += balls[i].vy;
       balls[i].vy += balls[i].g;

       if( balls[i].y >= WINDOW_HEIGHT-RADIUS ){
           balls[i].y = WINDOW_HEIGHT-RADIUS;
           balls[i].vy = - balls[i].vy*0.75;
       }
	}

	//对小球进行是否在画布内检测
	var cnt=0;
	for(var i=0;i<balls.length;i++){
		if (balls[i].x+RADIUS>0&&balls[i].x-RADIUS<WINDOW_WIDTH) {
			//把留在画布内的小球都留在画布前面
			balls[cnt++]=balls[i]
		}
	}

	while(balls.length>cnt){
		balls.pop();
	}
}
//添加小球
function addBalls(x,y,num){

	for(var i=0;i<digit[num].length;i++){

		for(var j=0;j<digit[num][i].length;j++){
			//采用random添加随机性   确定当前位置是否有小球
			if (digit[num][i][j]===1) {
				var aBall={
					x:x+j*2*(RADIUS+1)+(RADIUS+1),
                    y:y+i*2*(RADIUS+1)+(RADIUS+1),
                    g:1.5+Math.random(),
                    vx:Math.pow( -1 , Math.ceil( Math.random()*1000 ) ) * 4,
                    vy:-5,
                    color: colors[ Math.floor( Math.random()*colors.length ) ]
				}
				//新生成的小球添加到balls中
				balls.push(aBall);
			}

		}

	}
}

//绘制
function render(cxt){

	//对一个矩形区域里的动画进行刷新
	cxt.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT)

	var hours=parseInt(curShowTimeSeconds/3600);
	var minutes=parseInt((curShowTimeSeconds-hours*3600)/60);
	var seconds=curShowTimeSeconds%60;

	//从那个位置开始绘制，具体绘制的数字，在绘制的时候需要拆开绘制
	renderDigit(MARGIN_LEFT,MARGIN_TOP,parseInt(hours/10),cxt);
	renderDigit(MARGIN_LEFT+15*(RADIUS+1),MARGIN_TOP,parseInt(hours%10),cxt);
	renderDigit(MARGIN_LEFT+30*(RADIUS+1),MARGIN_TOP,10,cxt);
	renderDigit(MARGIN_LEFT+39*(RADIUS+1),MARGIN_TOP,parseInt(minutes/10),cxt);
	renderDigit(MARGIN_LEFT+54*(RADIUS+1),MARGIN_TOP,parseInt(minutes%10),cxt);
	renderDigit(MARGIN_LEFT+69*(RADIUS+1),MARGIN_TOP,10,cxt);
	renderDigit(MARGIN_LEFT+78*(RADIUS+1),MARGIN_TOP,parseInt(seconds/10),cxt);
	renderDigit(MARGIN_LEFT+93*(RADIUS+1),MARGIN_TOP,parseInt(seconds%10),cxt);

	//对小球进行绘制
	for(var i=0;i<balls.length;i++){
		cxt.fillStyle=balls[i].color;

		cxt.beginPath();
		cxt.arc(balls[i].x,balls[i].y,RADIUS,0,2*Math.PI,true);
		cxt.closePath();

		cxt.fill();
	}
}
//具体绘制
function renderDigit(x,y,num,cxt){
	cxt.fillStyle='rgb(0,102,153)';

	//i==10  j==7
	for(var i=0;i<digit[num].length;i++){

		for(var j=0;j<digit[num][i].length;j++){

			if (digit[num][i][j]===1) {
				cxt.beginPath();
				cxt.arc(x+j*2*(RADIUS+1)+(RADIUS+1),y+i*2*(RADIUS+1)+(RADIUS+1),RADIUS,0,2*Math.PI);
				cxt.closePath();
				cxt.fill();
			}

		}

	}

}