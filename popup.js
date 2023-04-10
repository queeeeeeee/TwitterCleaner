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

const OnRandom = async() => {
    const activeTab = await getActiveTabURL();
    var slider = document.getElementById("DelayRange");
    chrome.tabs.sendMessage(activeTab.id, slider.value, OnResult);
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

        var button = document.createElement('button');
        button.onclick = OnRandom;
        button.classList.add("button-17")
        button.innerHTML = "트윗 청소하기";
        container.appendChild(button);

    } else {
        const container = document.getElementsByName("container")[0];
        container.innerHTML = '본인의 트윗 및 답글 페이지를 열어주세요.';
        var button = document.getElementsByClassName("CleanButton")[0];
        if (button != null)
            button.parentNode.removeChild(button);
    }
});