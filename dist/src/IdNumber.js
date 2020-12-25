export var IdNumberGender;
(function (IdNumberGender) {
    IdNumberGender[IdNumberGender["Male"] = 0] = "Male";
    IdNumberGender[IdNumberGender["Female"] = 1] = "Female";
})(IdNumberGender || (IdNumberGender = {}));
export class IdNumber {
    constructor(idStr) {
        this.adcode = "";
        this.year = "";
        this.month = "";
        this.day = "";
        this.gender = "";
        this.checkSum = "";
        this.str = idStr.replace(/(^\s*)|(\s*$)/g, "");
        if (this.str.length != 18 && this.str.length != 15) {
            this.str = "";
            return;
        }
        if (this.str.length == 18
            && !/^[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[0-9xX]$/i.test(this.str)) {
            this.str = "";
        }
        if (this.str.length == 15
            && !/^[1-9]\d{7}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}$/.test(this.str)) {
            this.str = "";
        }
        let start = 0;
        this.adcode = this.str.substring(start, start + 6);
        start += 6;
        if (this.str.length == 15) {
            this.year = "19" + this.str.substring(start, start + 2);
            start += 2;
        }
        else {
            this.year = this.str.substring(start, start + 4);
            start += 4;
        }
        this.month = this.str.substring(start, start + 2);
        start += 2;
        this.day = this.str.substring(start, start + 2);
        start += 2;
        start += 2; //跳过随机位
        this.gender = this.str.substring(start, start + 1);
        start += 1;
        this.checkSum = "";
        if (this.str.length == 18) {
            this.checkSum = this.str.substring(start, start + 1).toLowerCase();
        }
    }
    isValid() {
        if (this.str.length != 15 && this.str.length != 18) {
            return false;
        }
        if (parseInt(this.day) > this.getMaxDays()) {
            return false;
        }
        if (!this.checkAdcode()) {
            return false;
        }
        if (this.str.length == 15) {
            return true;
        }
        let idDigits = this.str.split('');
        //∑(ai×Wi)(mod 11)
        //加权因子
        let factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        //校验位
        let check = ['1', '0', 'x', '9', '8', '7', '6', '5', '4', '3', '2'];
        let sum = 0;
        for (let i = 0; i < 17; i++) {
            sum += parseInt(idDigits[i]) * factor[i];
        }
        return check[sum % check.length] == this.checkSum;
    }
    getYear() {
        return this.year;
    }
    getMonth() {
        return this.month;
    }
    getDay() {
        return this.day;
    }
    getBirthdayTimestamp() {
        return new Date(`${this.year}-${this.month}-${this.day}`).getTime();
    }
    getAge() {
        let now = new Date();
        let nowYear = now.getFullYear();
        let nowMonth = now.getMonth() + 1;
        let nowDay = now.getDate();
        let length = (Number(nowYear) - Number(this.year));
        if (length < 0) {
            return 0;
        }
        if (Number(nowMonth) < parseInt(this.month)) {
            return length - 1;
        }
        if (Number(nowMonth) === parseInt(this.month) && Number(nowDay) < parseInt(this.day)) {
            return length - 1;
        }
        return length;
    }
    getGender() {
        return parseInt(this.gender) % 2 == 0 ? IdNumberGender.Female : IdNumberGender.Male;
    }
    getMaxDays() {
        return new Date(parseInt(this.year), parseInt(this.month), 0).getDate();
    }
    checkAdcode() {
        //11:"北京",12:"天津",13:"河北",14:"山西",15:"內蒙古",21:"遼寧",22:"吉林",23:"黑龍江"
        // ,31:"上海",32:"江蘇",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山東",41:"河南",
        // 42:"湖北",43:"湖南",44:"廣東",45:"廣西",46:"海南",50:"重慶",51:"四川",52:"貴州" ,
        // 53:"雲南",54:"西藏",61:"陝西",62:"甘肅",63:"青海",64:"寧夏",65:"新疆",71:"臺灣",
        // 81:"香港",82:"澳門",91:"國外"
        const allAdcode = new Set(["11", "12", "13", "14", "15",
            "21", "22", "23", "31", "32", "33", "34", "35", "36", "37", "41", "42", "43", "44",
            "45", "46", "50", "51", "52", "53", "54", "61", "62", "63", "64", "65", "71", "81",
            "82", "91"]);
        return allAdcode.has(this.adcode.substring(0, 2));
    }
}
