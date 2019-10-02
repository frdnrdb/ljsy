export default function(selector, container) {

    const config = {
        rootMargin: '-100px 0px',
        threshold: 0.01
    };
  
    function onIntersection(entries) {
        entries.map(entry => {
            if (entry.intersectionRatio <= 0) return;

            const el = entry.target;
            observer.unobserve(el);
            
            const img = new Image();
            const src = el.dataset.image;
            img.onload = function(){
                el.setAttribute('style', 'background-image:url('+src+')');
                el.classList.add('on');
            };
            img.src = src;
        });
    };
  
    const observer = 'IntersectionObserver' in window && new IntersectionObserver(onIntersection, config);
    const images = Array.from(container.querySelectorAll(selector));

    images.map(image => observer
        ? observer.observe(image)
        : image.setAttribute('style', 'background-image:url('+image.dataset.image+')') || image.classList.add('on')
    );

}