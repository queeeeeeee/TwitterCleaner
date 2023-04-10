var delay = 30;

function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}

async function OnClean(message) {

    //무한 반복
    //타임라인: () 님의 트윗 아래에서
    //cell Inner div를 모두 가져오기 
    //하나도 없으면 break하고 끝.
    //가져온 모든 cell Inner Div 마다
    //data-testid="socialContext"가 있는지 확인. 
    //"내가 리트윗함" 이면
    //안에서 aria-label="1417 리트윗. 리트윗함"을 찾기
    //onclick
    //delay 10
    //data-testid="unretweetConfirm" 찾기
    //onclick
    //delay 30
    //없을경우, aria-label="더 보기" 를 찾기
    //onclick
    //delay 10
    //data-testid="Dropdown" 찾기
    //아래에서 role="menuitem" 찾기
    //안에서 <span>삭제하기</span>가 있는지 확인
    //있으면 onclick
    //delay 10
    //data-testid="confirmationSheetConfirm" 찾기
    //onclick
    //delay 30
    var notMyTweetSet = new Set();
    var totalDeleteCount = 0;
    var endCounter = 0;
    while (true) {
        var deletecount = 0;

        var timelineElement = document.querySelectorAll('[aria-label^="타임라인:"][aria-label$="님의 트윗"]');
        if (timelineElement.length == 0) {
            throw ("Timeline find failed");
        }

        var cellInnverDives = timelineElement[0].querySelectorAll('[data-testid="cellInnerDiv"]');
        if (cellInnverDives.length == 0) {
            endCounter++;
            if (endCounter == 16)
                break;
        }

        for (var i = 0; i < cellInnverDives.length; i++) {
            var cellElement = cellInnverDives[i];

            if (notMyTweetSet.has(cellElement))
                continue;

            var socialContext = cellElement.querySelectorAll('[data-testid="socialContext"]');
            if (socialContext.length != 0) {
                if (socialContext[0].childNodes[0].textContent == "내가 리트윗함") {
                    var unretweet = cellElement.querySelectorAll('[aria-label$="리트윗함"]');

                    if (unretweet.length == 0) {
                        continue;
                    }

                    (unretweet[0]).click();
                    await sleep(delay);
                    var unretweetConfirm = document.querySelectorAll('[data-testid="unretweetConfirm"]');
                    unretweetConfirm[0].click();
                    deletecount += 1;
                }
            } else {
                var moreButton = cellElement.querySelectorAll('[aria-label="더 보기"]');

                if (moreButton.length == 0)
                    continue;

                moreButton[0].click();
                await sleep(delay)

                var dropdown = document.querySelectorAll('[data-testid="Dropdown"]');

                if (dropdown.length == 0)
                    continue;

                var firstButton = dropdown[0].querySelectorAll('[role="menuitem"]')[0];

                if (firstButton.querySelector('span').textContent == "삭제하기") {
                    firstButton.click();
                    await sleep(delay);
                    var button = document.querySelectorAll('[data-testid="confirmationSheetConfirm"]');
                    if (button.length != 0) {
                        button[0].click();
                        deletecount += 1;
                    }
                } else {
                    dropdown[0].parentNode.removeChild(dropdown[0]);
                    notMyTweetSet.add(cellElement);
                }
            }

            await sleep(delay);
        }


        if (deletecount == 0) {
            endCounter++;
            if (endCounter == 16)
                break;

            window.focus();
            window.scrollBy(0, 200);
            await sleep(message);
        } else {
            endCounter = 0;
            totalDeleteCount += deletecount;
        }
    }

    alert(totalDeleteCount + "개의 트윗 삭제 완료!");
}

chrome.runtime.onMessage.addListener((obj, sender, response) => {
    OnClean(obj);
});