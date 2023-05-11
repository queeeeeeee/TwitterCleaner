var delay = 30;

function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}

// 팝업 표시 함수
function showPopup(text, backgroundColor, coordinates) {
    // 팝업 요소 생성
    var popup = document.createElement('div');
    popup.classList.add('popup');
    popup.textContent = text;

    // 팝업 스타일 설정
    popup.style.position = 'fixed';
    popup.style.padding = '10px 20px';
    popup.style.borderRadius = '15px';
    popup.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';
    popup.style.zIndex = '9999';
    popup.style.opacity = '0';
    popup.style.transition = 'transform 0.3s, opacity 0.3s';
    popup.style.backgroundColor = backgroundColor;

    // 좌표 설정
    if (coordinates) {
        popup.style.top = coordinates.top + 'px';
        popup.style.left = coordinates.left + 'px';
    } else {
        // 랜덤한 위치 계산
        var windowHeight = window.innerHeight;
        var windowWidth = window.innerWidth;
        var popupWidth = popup.offsetWidth;
        var popupHeight = popup.offsetHeight;

        var randomTop = Math.floor(Math.random() * (windowHeight - popupHeight));
        var randomLeft = Math.floor(Math.random() * (windowWidth - popupWidth));

        popup.style.top = randomTop + 'px';
        popup.style.left = randomLeft + 'px';
    }

    // 팝업을 body에 추가
    document.body.appendChild(popup);

    // 팝업 표시 애니메이션
    setTimeout(function() {
        popup.style.transform = 'scale(1)';
        popup.style.opacity = '1';
    }, 10); // 10ms 후에 팝업 표시 애니메이션 시작

    // 팝업 사라지기 애니메이션
    setTimeout(function() {
        popup.style.opacity = '0';
        setTimeout(function() {
            popup.remove();
        }, 300); // 300ms 후에 팝업 제거
    }, 2700); // 2700ms 후에 팝업 사라지기 애니메이션 시작
}



async function OnTweetClean(message) {

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

    var maxY = 0;

    window.focus();
    window.scroll(0, 0);
    await sleep(500);

    var scrollCounter = 0

    while (true) {
        var beforeY = window.scrollY;

        window.focus();
        window.scrollBy(0, 10000);

        await sleep(800);

        var afterY = window.scrollY;

        if (beforeY == afterY) {
            scrollCounter++
            if (scrollCounter == 4)
                break
        } else
            scrollCounter = 0

    }

    maxY = window.scrollY

    var centerX = (window.innerWidth - 150) / 2;
    var centerY = (window.innerHeight - 100) / 2;

    showPopup('깊이 측정 완료', '#FF9CCE', { top: centerX, left: centerY })

    var delay = message.delay
    var deleteRetweet = message.deleteRetweet
    var deleteMytweet = message.deleteMytweet

    var notMyTweetSet = new Set();
    var totalDeleteCount = 0;
    while (true) {
        if (!deleteRetweet && !deleteMytweet)
            break
        if (window.scrollY == 0)
            break
        var deletecount = 0;

        var timelineElement = document.querySelectorAll('[aria-label^="타임라인:"][aria-label$="님의 트윗"]');
        if (timelineElement.length == 0) {
            throw ("Timeline find failed");
        }

        var cellInnverDives = timelineElement[0].querySelectorAll('[data-testid="cellInnerDiv"]');

        for (var i = 0; i < cellInnverDives.length; i++) {
            var cellElement = cellInnverDives[i];

            if (notMyTweetSet.has(cellElement))
                continue;

            var socialContext = cellElement.querySelectorAll('[data-testid="socialContext"]');
            if (socialContext.length != 0) {
                if (socialContext[0].childNodes[0].textContent == "내가 리트윗함" && deleteRetweet) {
                    var unretweet = cellElement.querySelectorAll('[aria-label$="리트윗함"]');

                    if (unretweet.length == 0) {
                        continue;
                    }

                    (unretweet[0]).click();
                    await sleep(delay);
                    var unretweetConfirm = document.querySelectorAll('[data-testid="unretweetConfirm"]');
                    unretweetConfirm[0].click();
                    deletecount += 1;
                    showPopup("리트윗 삭제됨!", '#19CF86')
                }
            } else if (deleteMytweet) {
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
                        showPopup("내 트윗 삭제됨!", '#55ACEE')
                    }
                } else {
                    dropdown[0].parentNode.removeChild(dropdown[0]);
                    notMyTweetSet.add(cellElement);
                }
            }

            await sleep(delay);
        }
        totalDeleteCount += deletecount;

        if (deletecount <= 10) {
            var before = window.screenTop

            window.focus();
            window.scrollBy(0, -400);
            await sleep(delay);
            var after = window.screenTop
        }
    }

    alert(totalDeleteCount + "개의 트윗 삭제 완료!");
}

async function OnHeartClean(message) {

    var skipSet = new Set();
    var totalDeleteCount = 0

    var timelineElement = document.querySelectorAll('[aria-label^="타임라인:"][aria-label$="님이 마음에 들어 한 트윗"]');
    if (timelineElement.length == 0) {
        throw ("Timeline find failed");
    }

    while (true) {
        var cellInnverDives = timelineElement[0].querySelectorAll('[data-testid="cellInnerDiv"]');

        for (var i = 0; i < cellInnverDives.length; i++) {
            if (skipSet.has(cellInnverDives[i]))
                continue
            skipSet.add(cellInnverDives[i])
            var unlike = timelineElement[0].querySelectorAll('[data-testid="unlike"]');
            if (unlike.length == 0)
                continue
            unlike[0].click()
            showPopup("마음 취소됨!", '#E0245E')
            totalDeleteCount++
        }

        var isScrolled = false
        for (var i = 0; i < 10; i++) {
            var beforeScroll = window.scrollY
            window.focus();
            window.scrollBy(0, 500);
            await sleep(300);
            var nowScroll = window.scrollY

            if (beforeScroll != nowScroll) {
                isScrolled = true
                break
            }
        }

        if (!isScrolled)
            break
    }

    alert(totalDeleteCount + "개의 마음 삭제 완료!");
}


chrome.runtime.onMessage.addListener((obj, sender, response) => {
    if (obj.isDeleteHeart)
        OnHeartClean(obj);
    else
        OnTweetClean(obj);
});