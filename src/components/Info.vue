<template>
    <div class="wrapper">
			<div class="container-fluid">
				<div class="row fill-h">
					<div class="col-lg-7 fill-h">
						<div class="xpanel-wrapper xpanel-wrapper-1">
							<div class="xpanel no-bg">
								<div class="fill-h" id="bar3D"></div>
							</div>
						</div>
					</div>
					<div class="col-lg-5 fill-h">
						<div class="xpanel-wrapper xpanel-wrapper-2-3">
							<div class="xpanel">
								<div class="fill-h" id="globe3D"></div>
							</div>
						</div>
						<div class="xpanel-wrapper xpanel-wrapper-1-3">
							<div class="xpanel">
								<div class="fill-h" id="bar2D"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
</template>
<script>
export default {
    
}
</script>
<style>
    @charset "utf-8";

/********** Global **********/
/*
 *常用背景色： #0f1c30 #0b0f34 (6,64,102) (29,45,57) (7,33,58) (8,13,28) (15,43,36)
 */
html, body {
	width:100%;
	height:100%;
	min-height:635px;
	font-family:"microsoft yahei", arial, sans-serif;
	background-color:#0f1c30;
	background-repeat:no-repeat;
	background-position:center;
	background-size:100% 100%;
	overflow-x:hidden;
	overflow-y:auto;
}
body.bg05 {background-image:url("../assets/img/InfoIMG/panel.png");}
body.bg06 {background-image:url("../assets/img/InfoIMG/panel.png");}
body.bg07 {background-image:url("../assets/img/InfoIMG/panel.png");}
body.bg08 {background-image:url("../assets/img/InfoIMG/panel.png");}
.header {
	margin:0 auto;
	width:100%;
	height:72px;
	max-width:1920px;
	background:url("../assets/img/InfoIMG/panel.png") center no-repeat;
	background-size:100% 100%;
}
.header h3 {
	margin:0;
	padding:0;
	line-height:44px;
	text-align:center;
	font-size:24px;
	color:#5dc2fe;
}
.wrapper {position:absolute;top:87px;bottom:0;left:0;right:0;min-height:545px;}
.container-fluid {height:100%;min-height:100%;}
.row {margin-left:-7px;margin-right:-8px;}
.row>div {padding-left:7px;padding-right:8px;}
.xpanel-wrapper {padding-bottom:15px;box-sizing:border-box;}
.xpanel-wrapper-1 {height:100%;}
.xpanel-wrapper-2 {height:50%;}
.xpanel-wrapper-1-3 {height:33.33333%;}
.xpanel-wrapper-2-3 {height:66.66666%;}
.xpanel {
	padding:15px;
	height:100%;
	min-height:170px;
	background:url("../assets/img/InfoIMG/panel.png") center no-repeat;
	background-size:100% 100%;
	box-sizing:border-box;
}

/* tool */
.fill-h {height:100%;min-height:100%;}
.no-margin {margin:0 !important;}
.no-padding {padding:0 !important;}
.no-bg {background:none !important;}
.no-border {border:0 !important;}

/* scrollbar */
::-webkit-scrollbar {width:0;height:0;}
::-webkit-scrollbar-track {background-color:transparent;}
::-webkit-scrollbar-thumb {border-radius:5px;background-color:rgba(0, 0, 0, 0.3);}
</style>