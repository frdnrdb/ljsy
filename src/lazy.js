export default function(selector, container) {

    const images = Array.from(container.querySelectorAll(selector));
    const isBG = images[0].nodeName !== 'IMG';
    const dataSelector = images[0].dataset.src ? 'src' : 'image';
    const rootMargin = Math.round(window.innerHeight / 2) + 'px';
    
    const show = (el, src) => {
        isBG && el.setAttribute('style', 'background-image:url('+src+')');
        el.classList.add('on');
    };

    const config = {
        rootMargin: `-${rootMargin}px 0px`,
        threshold: 0.01
    };
  
    function onIntersection(entries) {
        entries.map(entry => {
            if (entry.intersectionRatio <= 0) return;

            const el = entry.target;
            observer.unobserve(el);
            
            const img = new Image();
            const src = el.dataset[dataSelector];
            img.onload = () => show(el, src);
            img.src = src;
        });
    };
  
    const observer = 'IntersectionObserver' in window && new IntersectionObserver(onIntersection, config);

    images.map(image => observer
        ? observer.observe(image)
        : show(image, image.dataset[dataSelector])
    );

}