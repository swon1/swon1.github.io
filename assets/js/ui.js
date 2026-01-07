export function uiFn () {

    const projectFn = ( ) => {
        let projectListBoxWidth = document.querySelector('.project__content--list-viewbox').clientWidth;
        let projectListInner = document.querySelector('.project__content--list-inner ul');
        let projectListchildren = projectListInner.children;

        for ( let i = 0; i < projectListchildren.length; i++ ) {
            projectListchildren[i].style.width = `${projectListBoxWidth}px`
        }

        let projectListWidth = projectListchildren[0].clientWidth;
        projectListInner.style.width = (projectListWidth*projectListchildren.length)+'px';

        let projectListBtn = document.querySelectorAll('.project__content--list .project__content--btn');
        projectListBtn.forEach((el, i) => {
            el.addEventListener('click', (e) => {
                let dataStatus = (e.target).getAttribute('data-list-status');

                if ( dataStatus == 'view' ) {
                    document.querySelector('.project__content--list-viewbox').classList.add('view');
                    document.querySelector('.project__content--list-box').classList.add('view');
                }
                if ( dataStatus == 'none') {
                    document.querySelector('.project__content--list-viewbox').classList.remove('view');
                    document.querySelector('.project__content--list-box').classList.remove('view');
                }
            });
        });


        // window.addEventListener('resize', (e) => {
        //     projectListBoxWidth = document.querySelector('.project__content--git').clientWidth;

        //     for ( let i = 0; i < projectListchildren.length; i++ ) {
        //         projectListchildren[i].style.width = `${projectListBoxWidth}px`
        //     }
        // });



    }


    let modalOpen = document.querySelectorAll('.project__content--list-viewbtn');
    let modalClose = document.querySelectorAll('.modal__close');

    modalOpen.forEach( (el, i) => {
        el.addEventListener('click', (e) => {
            let modalDate = (e.target).getAttribute('data-project-list');

            document.querySelector('.modal').style.display = 'block';
            document.querySelector('.modal').classList.add('active');
            document.querySelector(`#${modalDate}`).style.display = 'block';
            document.querySelector(`#${modalDate}`).classList.add('view');
        });
    });

    modalClose.forEach( (el, i) => {
        el.addEventListener('click', (e) => {
            document.querySelector('.modal').style.display = 'none';
            document.querySelector('.modal').classList.remove('active');
            document.querySelector('.modal__content.view').style.display = 'none';
            document.querySelector('.modal__content.view').classList.remove('view');
        });
    });

    projectFn();
}

export function sectionMotion () {
    let box = document.querySelectorAll('.section-box');
    let total = box.length -1;
    let idx = 0;
    let motion;

    let projectBox = document.querySelector('.project__content--list-box');
    let modal = document.querySelector('.modal');

    box[0].style.top = '0%';

    let zidx = total+1;

    for ( let i = 0; i < total; i++ ) {
        box[i].style.zIndex = zidx;
        zidx--;
    }

    function pageUp () {
        let preidx = idx;
        if ( idx <= 0 ) {
            motion = false;
            ldx = 0;
            return;
        } else {
            setTimeout( () => {
                motion = false;
            }, 1200 );
            idx--;
            updateNavStatus();
        }

        gsap.to( box[preidx], 1.05, { top : '80%', ease: "power4.inOut", }, );
        gsap.to( box[idx], 1.05, { top : '0%', ease: "power4.inOut", }, );
    }
    function pageDown () {
        let preidx = idx;
        if ( idx >= total ) {
            motion = false;
            idx = total;
            return;
        } else {
            setTimeout( () => {
                motion = false;
            }, 1200 );
            idx++;
            updateNavStatus();
        }
        
        gsap.to( box[preidx], 1.05, { top : '100%', ease: "power4.inOut", }, );
        gsap.to( box[idx], 1.05, { top : '0%', ease: "power4.inOut", }, );
    }

    // mouse Wheel Event
    function wheelFn () {
        [].forEach.call( box, ( el ) => {
            el.addEventListener('wheel', ( event ) => {
                let modalStyle = getComputedStyle(modal);
                let modalProperty = modalStyle.display;
                if ( modalProperty == 'block' ) {
                    return;
                } else {
                    event.preventDefault();
                    let wCheck = event.wheelDelta;

                    if ( !(motion) ) {
                        motion = true;
                        if ( wCheck > 0 ) {
                            pageUp();
                        } else {
                            pageDown();
                        }
                    } else {
                        return;
                    }
                }
            }, { passive : false });
        });
    }
    function touchFn () {
        let boxH = box[0].clientHeight;

        let $touchStart, $touchMove, $touchEnd;
        let $touchCheck;

        [].forEach.call( box, ( el ) => {
            el.addEventListener('touchstart', ( evt ) => {
                if ( !evt.target.closest('a, button, input') ) {
                    let modalStyle = getComputedStyle(modal);
                    let modalProperty = modalStyle.display;
                    if ( modalProperty == 'block' ) {
                        return;
                    } else if ( projectBox.classList.contains('view') ) {
                        return;
                    } else {
                        evt.preventDefault();
                        $touchCheck = false;
                        $touchStart = evt.touches[0].pageY;
                    }
                } else {
                    return;
                }
            });

            // ■ touchMove :: 터치 상하 이동 감지 후 동작
            el.addEventListener('touchmove', ( evt ) => {
                let modalStyle = getComputedStyle(modal);
                let modalProperty = modalStyle.display;
                if ( modalProperty == 'block' ) {
                    return;
                } else if ( projectBox.classList.contains('view') ) {
                    return;
                } else {
                    evt.preventDefault();

                    $touchMove = evt.touches[0].clientY;

                    if ( !(motion) ) {
                        if ( !$touchCheck ) {
                            if ( $touchMove < ($touchStart - (boxH / 5)) ) {
                                motion = true;
                                $touchCheck = true;
                                pageDown();
                            } else if ( $touchMove > ($touchStart + (boxH / 5))) {
                                motion = true;
                                $touchCheck = true;
                                pageUp();
                            }
                        } else {
                            return;
                        }
                    } else {
                        return;
                    }    
                }                       
            },{ passive : false });
        });
    }

    // nav click Event
    function navFn () {
        const navLinks = document.querySelectorAll('#nav a');

        navLinks.forEach((link, i) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                if (motion || idx === i) return; 
                
                motion = true;
                let targetIdx = i;
                let preIdx = idx;

                setTimeout(() => {
                    motion = false;
                }, 1200);

                if (targetIdx > preIdx) {
                    for (let k = preIdx; k < targetIdx; k++) {
                        gsap.to(box[k], 1.05, { top: '100%', ease: "power4.inOut" });
                    }
                    gsap.to(box[targetIdx], 1.05, { top: '0%', ease: "power4.inOut" });

                } else {
                    gsap.to(box[preIdx], 1.05, { top: '80%', ease: "power4.inOut" });
                    for (let k = targetIdx; k < preIdx; k++) {
                        gsap.to(box[k], 1.05, { top: '0%', ease: "power4.inOut" });
                    }
                }
                idx = targetIdx;
                updateNavStatus();
            });
        });
    }

    function updateNavStatus() {
        const aside = document.querySelector('#nav');
        const currentId = box[idx].id;

        aside.setAttribute('data-section', currentId);

        const navLinks = document.querySelectorAll('#nav a');
        navLinks.forEach(link => link.classList.remove('active'));
        if(navLinks[idx]) navLinks[idx].classList.add('active');
    }

    wheelFn();
    touchFn();
    navFn();
    updateNavStatus();
}