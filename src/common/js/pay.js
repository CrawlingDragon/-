<script>
$("#doWePay").click(function(){
	var form = $("#wepay_form");
	var form_data = form.serialize();
	
	$("#doWePay").val("正在处理支付...");
	$("#doWePay").attr("disabled",true);

	var u = navigator.userAgent;
   	var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
	$.ajax({
        type: "POST",
        url: "{:U('User/PayOrder/wepay')}",
        data:form_data,
        success: function (data) {
        	if(data.status==1){
        		if(is_weixin()){
        			//微信客户端内部，调用jsapi支付
        			var weinfo = data.info;
        			function onBridgeReady() {
        				WeixinJSBridge.invoke('getBrandWCPayRequest', {
        					"appId" : weinfo.appId, //公众号名称，由商户传入     
        					"timeStamp" : weinfo.timeStamp, //时间戳，自1970年以来的秒数     
        					"nonceStr" : weinfo.nonceStr, //随机串     
        					"package" : weinfo.package,
        					"signType" : weinfo.signType, //微信签名方式：     
        					"paySign" : weinfo.paySign //微信签名 
        				}, function(res) {
        					if (res.err_msg == "get_brand_wcpay_request:ok") {
        						// 使用以上方式判断前端返回,微信团队郑重提示：
        						//res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
	        					window.location.href = "{$return_url}";
        					}
        				});
        			}
        			if (typeof WeixinJSBridge == "undefined") {
        				if (document.addEventListener) {
        					document.addEventListener('WeixinJSBridgeReady', onBridgeReady,
        							false);
        				} else if (document.attachEvent) {
        					document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
        					document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
        				}
        			} else {
        				onBridgeReady();
        			}
        		}
        		else{
        			//不是微信客户端，调用h5支付
	        		window.location.href = data.info.mweb_url + "&redirect_url=" + encodeURIComponent("{$return_url}");
        		}
			}
			else{
				alert(data.info);
			}
        	$("#doWePay").val("立即支付");
        	$("#doWePay").removeAttr("disabled");
        }
    });
	return false;
});
function is_weixin() {
	var ua = navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i) == "micromessenger") {
	   return true;
	} else {
	   return false;
	}
}
</script>