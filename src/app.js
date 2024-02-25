const textInput = document.getElementById('user-input');
const renderedText = document.getElementById('rendered-text');

textInput.addEventListener('input', () => {
    inputToURL(textInput.value)
});

const optionValues = {
    'danyao': '777m234888p4568s_8s',
    'iipee': '334455s55m5m*123p3z_3z',
    'pinho': '45678p123s34599m_9p',
    'sansyoku': '7z123m123p123s678m_7z',
    'sandookoo': '666m666p66s789s99m_6s',
    'sankantsu': '567s99m_0880m 222p-2p= 3s-333s',
    'syousan': '77666555z678s88m_8m',
    'ittsuu': '234m123456789s7z_7z',
    'chanta': '99123m123999p77z_9m',
    'toitoi': '444m222s7z_4z4z-4z 99m-9m_7z',
    'sananko': '111m111p444p34s11z_5s*',
    'chitoi': '11m44m88m99m44p22s4z_4z',
    'honroo': '666z222z999s1m_1p-11p_1m',
    'honiisoo': '11222567p22233z_1p',
    'jyunchan': '1112378p123999s_9p',
    'ryopee': '223344s667788p6z_6z',
    'chinitsu': '2344466777999m_1m',
    'kokushi': '19m19p19s1234567z_1m',
    'chulen': '1112345678999m_2m',
    'suuan': '111m111p444p333s1z_1z',
    'suukantsu': '44s_2m-22m2m 222p2p- 22s2s-2s 555z5z-',
    'daisangen': '555666777z678s5m_5m*',
    'daishushi': '11122233344z22s_4z',
    'syoushushi': '1112223344z333s_3z',
    'tsuiso': '1133344477755z_5z',
    'ryuiso': '22234666888s66z_2s',
    'chinroo': '1119m111999p999s_9m'
};

document.getElementById('selectOptions').addEventListener('change', function() {
    const selectedOptionId = this.selectedOptions[0].id;
    textInput.value = optionValues[selectedOptionId] || '';
    inputToURL(textInput.value)
});

Array.from(document.getElementsByClassName("copy-link-btn"))
    .forEach(function(element) {
        element.addEventListener("click", function() {
    var dummy = document.createElement("input");
    document.body.appendChild(dummy);
    dummy.value = window.location.href;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
});
	});


	Array.from(document.getElementsByClassName("share-on-facebook"))
    .forEach(function(element) {
        element.addEventListener("click", function() {
    const facebookShareURL = `https://www.facebook.com/sharer.php?u=${encodeURIComponent(window.location.href)}`;
    window.open(facebookShareURL, "_blank");
});});


Array.from(document.getElementsByClassName("share-on-x"))
    .forEach(function(element) {
        element.addEventListener("click", function() {
    const message = `${window.location.href}`
    const twitterShareURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
    window.open(twitterShareURL, "_blank");
});});


Array.from(document.getElementsByClassName("save-png-btn"))
    .forEach(function(element) {
        element.addEventListener('click', function() {
    textToImage(renderedText.innerText, `${textInput.value}.png`);
});});

function encodeURL(url) {
    return url.replaceAll(" ", ".")
}

function decodeURL(url) {
    return url.replaceAll(".", " ")
}

function inputToURL(input) {
    renderedText.innerHTML = decodeURL(transformString(input));
    window.location.hash = encodeURL(transformString(input));
}

function textToImage(text, filename) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    const textMetrics = context.measureText(text);
    console.log(textMetrics, renderedText.offsetWidth)

    const imagePadding = 100
    const scaleProp = 5

    const fontFamily = window.getComputedStyle(renderedText).fontFamily;
    const fontSize = parseFloat(window.getComputedStyle(renderedText).fontSize) * scaleProp;

    context.font = `${fontSize}px ${fontFamily}`
    canvas.width = context.measureText(text).width + imagePadding * 2
    canvas.height = parseInt(window.getComputedStyle(renderedText).fontSize) * scaleProp + imagePadding * 2;

    context.font = `${fontSize}px ${fontFamily}`
    context.fillText(text, imagePadding, parseInt(window.getComputedStyle(renderedText).fontSize) * scaleProp + imagePadding * 1.7)

    const imageData = canvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.href = imageData;
    link.download = filename;
    link.click();
}

function transformString(str) {
    let charArr = str.trim().split("");
    const result = []
    var stack = []
    var indicator
    for (let i = 0; i < charArr.length; i++) {
        if (/([A-Za-z])/.test(charArr[i])) { // indicators (m, p, s, z)
            indicator = charArr[i]

            for (let j = 0; j < stack.length; j++) {
                result.push(`${stack[j]}${indicator}`)
            }

            stack = []
        } else if (/\d/.test(charArr[i])) { // numbers
            stack.push(charArr[i])
        } else { //symbols (*, -, =)
            result.push(`${charArr[i]}`)
        }
    }
    console.log(result.concat(stack).join(""))
    return result.concat(stack).join("")
}

function main() {
    if (window.location.hash) {
        try {
            textInput.value = (decodeURL(window.location.hash.substring(1)))
            renderedText.innerText = transformString(decodeURL(window.location.hash.substring(1)))
            console.log(`→ Url Get: ${window.location.hash}`)
        } catch (e) {
            console.log("→ Get Invalid Url, Random Select an Emoji 🎰", e)
        }
    } else {
        console.log("→ Get Basic URL")
        const demoString = "45p*345m*88m_0220m_33s3s-3s=_6p"
        window.location.hash = encodeURL(demoString)
        textInput.value = (decodeURL(window.location.hash.substring(1)))
        renderedText.innerText = transformString(decodeURL(window.location.hash.substring(1)))
    }
}

main()