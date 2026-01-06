export function dragScrollFn () {
    let isDown = false;
    const mouseScroll = function ( ele ) {
        const scrollTarget = ele;
        let startX;
        let scrollLeft;

        const scrollStartFn = function (e) {
            scrollTarget.classList.add('active');
            startX = e.pageX - scrollTarget.offsetLeft;
            scrollLeft = scrollTarget.scrollLeft;
            window.addEventListener('mousemove',scrollMoveFn);
            window.addEventListener('mouseup',scrollEndFn);
        };
        const scrollMoveFn = function (e) {
            isDown = true;
            const x = e.pageX - scrollTarget.offsetLeft;
            const walk = x - startX;
            scrollTarget.scrollLeft = scrollLeft - walk;
        };
        const scrollEndFn = function (e) {
            scrollTarget.classList.remove('active');

            window.removeEventListener('mousedown',scrollStartFn);
            window.removeEventListener('mousemove',scrollMoveFn);
            window.removeEventListener('mouseup',scrollEndFn);

            setTimeout(function(){
                isDown = false;
            },50);
        };
        const eventFn = function () {
            scrollTarget.addEventListener('mousedown',scrollStartFn);
        };
        eventFn();
    };

    const multiScroll = function ( ele ) {
        const scrollTarget = ele;
        let startX;
        let scrollLeft;
        let moved;
        let tarEl;

        const scrollStartFn = function (el,e) {
            el.classList.add('active');
            startX = e.pageX - el.offsetLeft;
            scrollLeft = el.scrollLeft;
            moved = true;
            window.addEventListener('mousemove', (e) => { scrollMoveFn(el,e) });
            window.addEventListener('mouseup', (e) => { scrollEndFn(el,e) });
        };
        const scrollMoveFn = function (el,e) {
            if ( !moved ) { return; }
            el = tarEl;
            isDown = true;
            const x = e.pageX - el.offsetLeft;
            const walk = x - startX;
            el.scrollLeft = scrollLeft - walk;
        };
        const scrollEndFn = function (el,e) {
            tarEl.classList.remove('active');

            window.removeEventListener('mousemove',scrollMoveFn);
            window.removeEventListener('mouseup',scrollEndFn);
            el.removeEventListener('mousedown',scrollStartFn);

            moved = false;

            setTimeout(function(){
                isDown = false;
            },50);
        };
        const eventFn = function () {
            [].forEach.call( scrollTarget, ( el ) => {
                el.addEventListener('mousedown', (e) => {
                    tarEl = el;
                    scrollStartFn(tarEl,e);
                });
            });
        };
        eventFn();
    };
    
    // 여러개일 경우
    const scrollmEl = document.querySelectorAll('.mouseScroll');
    multiScroll( scrollmEl );
}