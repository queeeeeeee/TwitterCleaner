async function getActiveTabURL() {
    const tabs = await chrome.tabs.query({
        currentWindow: true,
        active: true
    });

    return tabs[0];
}

const OnResult = (result) => {
    // document.getElementsByName("result")[0].innerHTML = result;
};

const OnHeartClean = async() => {
    const activeTab = await getActiveTabURL();
    var message = {
        delay: -1,
        deleteRetweet: false,
        deleteMytweet: false,
        isDeleteHeart: true
    }

    chrome.tabs.sendMessage(activeTab.id, message, OnResult);
}

const OnTweetClean = async() => {

    var value1 = document.getElementById("checkbox1").checked
    var value2 = document.getElementById("checkbox2").checked

    const activeTab = await getActiveTabURL();
    var slider = document.getElementById("DelayRange");
    var message = {
        delay: slider.value,
        deleteRetweet: value1,
        deleteMytweet: value2,
        isDeleteHeart: false
    }

    chrome.tabs.sendMessage(activeTab.id, message, OnResult);
}

document.addEventListener("DOMContentLoaded", async() => {
    const activeTab = await getActiveTabURL();

    var slider = document.getElementById("DelayRange");
    var output = document.getElementById("delayValue");
    output.innerHTML = slider.value;

    slider.oninput = function() {
        output.innerHTML = this.value;
    }

    if (activeTab.url.includes("twitter.com") && activeTab.url.includes("with_replies")) {
        const container = document.getElementsByName("container")[0];
        container.innerHTML = '';

        // fieldset 요소 생성
        var fieldset = document.createElement('fieldset');

        // legend 요소 생성
        var legend = document.createElement('legend');
        legend.textContent = '옵션 선택하기';
        fieldset.appendChild(legend);

        // "리트윗 지우기" 체크박스와 레이블을 감싸는 div 생성
        var checkbox1Div = document.createElement('div');
        checkbox1Div.style.display = 'flex';
        checkbox1Div.style.alignItems = 'center';
        var checkbox1 = document.createElement('input');
        checkbox1.type = 'checkbox';
        checkbox1.id = 'checkbox1';
        checkbox1.checked = true; // 기본으로 체크되도록 설정
        checkbox1Div.appendChild(checkbox1);
        var label1 = document.createElement('label');
        label1.textContent = '리트윗 지우기';
        label1.style.marginLeft = '8px';
        label1.setAttribute('for', 'checkbox1');
        checkbox1Div.appendChild(label1);
        fieldset.appendChild(checkbox1Div);

        // "내 트윗 지우기" 체크박스와 레이블을 감싸는 div 생성
        var checkbox2Div = document.createElement('div');
        checkbox2Div.style.display = 'flex';
        checkbox2Div.style.alignItems = 'center';
        var checkbox2 = document.createElement('input');
        checkbox2.type = 'checkbox';
        checkbox2.id = 'checkbox2';
        checkbox2.checked = true; // 기본으로 체크되도록 설정
        checkbox2Div.appendChild(checkbox2);
        var label2 = document.createElement('label');
        label2.textContent = '내 트윗 지우기';
        label2.style.marginLeft = '8px';
        label2.setAttribute('for', 'checkbox2');
        checkbox2Div.appendChild(label2);
        fieldset.appendChild(checkbox2Div);

        container.appendChild(fieldset)

        var button = document.createElement('button');
        button.onclick = OnTweetClean;
        button.classList.add("button-17")
        button.innerHTML = "트윗 청소하기";
        button.style = "margin-top: 1rem;margin-bottom: 1rem"
        container.appendChild(button);

    } else if (activeTab.url.includes("twitter.com") && activeTab.url.includes("likes")) {
        const container = document.getElementsByName("container")[0];
        container.innerHTML = '';

        var button = document.createElement('button');
        button.onclick = OnHeartClean;
        button.classList.add("button-17")
        button.innerHTML = "마음함 청소하기";
        container.appendChild(button);
    } else {
        const container = document.getElementsByName("container")[0];
        container.innerHTML = '본인의 트윗 및 답글 페이지, 혹은 마음 페이지를 열어주세요.';
        var button = document.getElementsByClassName("CleanButton")[0];
        if (button != null)
            button.parentNode.removeChild(button);
    }
});