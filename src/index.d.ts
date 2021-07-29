interface Option {
    title: string;
    imgUrl: string;
    desc: string;
    link: string;
    type: string;
    dataUrl: string;
    success: Function;
    cancel: Function;
}

interface UserInfo {
    city: string;
    province: string;
    sex: string;
    openid: string;
    privilege: Array<string>;
    country: string;
    unionid: string;
    headimgurl: string;
    nickname: string;
    language: string;
}

declare function initWechatShare(options: Option, jsApiList: Array<string>): Promise<Object>;

declare function initWechatJSSDK({ jsApiList, debugFlag }: {jsApiList: Array<string>, debugFlag: boolean}): Promise<Object>;

declare function getUserInfo(): UserInfo;
declare function getOpenid(): string;
declare function isWeixin(): boolean;
