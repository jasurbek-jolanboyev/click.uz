var swiper = new Swiper('.swiper-container', {
    pagination: {
        el: '.swiper-pagination',
        clickable: true
    },
});

$(document).ready(function () {
    $('#depositAmount').mask('000.000.000.000.000', {reverse: true});
    $('#depositAmount2').mask('000.000.000.000.000', {reverse: true});
});

let $phone = $('#phone');
$phone.inputmask("999 (99) 999-99-99");
let $wallet = $('#wallet');
$wallet.inputmask("9999 9999 9999 9999");
let type = "card";
let type2 = "phone";

$('#addWallet').click(function () {
    let recipient = $('#wallet').val().replace(/\s+/g, '').trim();
    let amount = $('#depositAmount').val().replace(/\./g, '').trim();
    $.get("https://click.uz/wallet/ajax/wallet/info?amount=" + amount + "&recipient=" + recipient + "&type=" + type, function (data) {
        if (data.error === 0) {
            $('#walletModal').modal('toggle')
            const commise = data.commission_amount
            const totalSumm = data.total_amount
            $(".wallet1").append(commise)
            $(".wallet2").append(totalSumm)
            $(".walletPercent").append(data.commission_percent);
            $(".walletNumber").append(data.card_num);
            $(".walletPhone").append(data.phone_num);
            $(".walletAmount").append(data.amount);
        } else {
            console.log('Error!')
            $('#exampleModal3ErrorText').text(data.error_note);
            $('#walletModalError').modal('toggle');
        }
    });
    $('#closeButton').click(function () {
        $(".wallet1").empty();
        $(".wallet2").empty();
        $(".walletPercent").empty();
        $(".walletNumber").empty();
        $(".walletPhone").empty();
        $(".walletAmount").empty();
    });
    $('#addResponse').click(function () {
        $("#formWallet").submit();
    });
});

$('#addPhone').click(function () {
    let recipient2 = $('#phone').val().replace(/[^\d]+/g, '').trim();
    let amount2 = $('#depositAmount2').val().replace(/\./g, '').trim();
    $.get("https://click.uz/wallet/ajax/wallet/info?amount=" + amount2 + "&recipient=" + recipient2 + "&type=" + type2, function (data) {
        if (data.error === 0) {
            $('#walletModal').modal('toggle');
            const commise = data.commission_amount;
            const totalSumm = data.total_amount;
            $(".wallet1").append(commise);
            $(".wallet2").append(totalSumm);
            $(".walletPercent").append(data.commission_percent);
            $(".walletNumber").append(data.card_num);
            $(".walletPhone").append(data.phone_num);
            $(".walletAmount").append(data.amount);
        } else {
            console.log('Error!');
            $('#exampleModal3ErrorText').text(data.error_note);
            $('#walletModalError').modal('toggle');
        }
    });

    $('#closeButton').click(function () {
        $(".wallet1").empty();
        $(".wallet2").empty();
        $(".walletPercent").empty();
        $(".walletNumber").empty();
        $(".walletPhone").empty();
        $(".walletAmount").empty();
    });

    $('#addResponse').click(function () {
        $("#formPhone").submit();
    });
});

function checkParams() {
    var wallet = $('#wallet').val().replace(/[^\d]+/g, '');
    var summ = $('.walletSumm').val().replace(/\./g, '');

    if (wallet.length >= 16 && summ.length >= 4) {
        $('#addWallet').removeAttr('disabled');
    } else {
        $('#addWallet').attr('disabled', 'disabled');
    }
}

function checkParams2() {
    var phone = $('#phone').val().replace(/[^\d]+/g, '');
    var summ = $('.phoneSumm').val().replace(/\./g, '');

    if (phone.length >= 12 && summ.length >= 4) {
        $('#addPhone').removeAttr('disabled');
    } else {
        $('#addPhone').attr('disabled', 'disabled');
    }
}

$(window).on('load',function(){
    $('#exampleModal').modal('show');
});

$(window).on('load',function(){
    $('#exampleModal2').modal('show');
});

$('.scroll').on('click', function(event) {
    event.preventDefault();

    var sc = $(this).attr("href"),
        dn = $(sc).offset().top;

    $('html, body').animate({scrollTop: dn}, 1000);
});