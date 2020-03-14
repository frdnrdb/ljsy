export const canPlayHLS = (() => {
    try {
        return !!(
            (window.MediaSource || window.WebKitMediaSource).isTypeSupported('video/mp4; codecs="avc1.42E01E,mp4a.40.2"') 
            && typeof window.SourceBuffer.prototype.appendBuffer
        );
    }
    catch(e) {}
})();