export class DownloadUtility {

    /**
     *
     * @param name begining of filename of data to be downloaded - timestamp with .json extension will be appended to value
     * @param data data to download under 'data' key
     */
    public static downloadJsonData(name: string, data: any): void {
        if (!!data) {
            const filename = name + DownloadUtility.getDashTimeStamp() + '.json';
            const element = document.createElement('a');
            element.download = filename;
            element.href = 'data:application/json;charset=utf-8;,' + encodeURIComponent(JSON.stringify({ data }));
            element.target = '_blank';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        }
    }

    /**
     * remove any characters from file that would be removed on Windows system
     * @param name value to be filename
     */
    public static filenameSafeString(name: string): string {
        return name.replace(/[<>:"/\|?*]/g, '').replace(/[ .]/g, '-');
    }

    /**
     * return data in format yyyy-MM-dd-hh-mm-ss-mmm
     * @param date Date value to use for timestamp - defaults to a new Date object
     */
    public static getDashTimeStamp(date: Date = new Date()): string {
        const validDate: Date = !!date && !!date.getTime() ? date : new Date();
        const dash: string = '-';
        const year: string = '' + validDate.getFullYear();
        const month: string = DownloadUtility.getTwoDigitString(validDate.getMonth() + 1);
        const day: string = DownloadUtility.getTwoDigitString(validDate.getDate());
        const hour: string = DownloadUtility.getTwoDigitString(validDate.getHours());
        const minute: string = DownloadUtility.getTwoDigitString(validDate.getMinutes());
        const second: string = DownloadUtility.getTwoDigitString(validDate.getSeconds());
        const milli: string = DownloadUtility.getThreeDigitString(validDate.getMilliseconds());
        return dash + year + dash + month + dash + day + dash + hour + dash + minute + dash + second + dash + milli;
    }

    private static getTwoDigitString(value: number): string {
        return ('0' + value).slice(-2);
    }

    private static getThreeDigitString(value: number): string {
        return ('00' + value).slice(-3);
    }
}
