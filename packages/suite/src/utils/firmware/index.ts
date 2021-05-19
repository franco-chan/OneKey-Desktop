import { AppState, TrezorDevice } from '@suite-types';

export const getFormattedFingerprint = (fingerprint: string) => {
    return [
        fingerprint.substr(0, 16),
        fingerprint.substr(16, 16),
        fingerprint.substr(32, 16),
        fingerprint.substr(48, 16),
    ]
        .join('\n')
        .toUpperCase();
};

export const getTextForStatus = (status: AppState['firmware']['status']) => {
    switch (status) {
        case 'waiting-for-confirmation':
            return 'TR_WAITING_FOR_CONFIRMATION';
        case 'started':
        case 'installing':
            return 'TR_INSTALLING';
        case 'wait-for-reboot':
            return 'TR_WAIT_FOR_REBOOT';
        case 'unplug':
            return 'TR_DISCONNECT_YOUR_DEVICE';
        default:
            return null;
    }
};
export const getDescriptionForStatus = (status: AppState['firmware']['status']) => {
    switch (status) {
        case 'started':
        case 'installing':
        case 'wait-for-reboot':
            return 'TR_DO_NOT_DISCONNECT';
        default:
            return null;
    }
};

type VersionArray = [number, number, number];

export const parse = (versionArr: VersionArray) => {
    return {
        major: versionArr[0],
        minor: versionArr[1],
        patch: versionArr[2],
    };
};

export const toString = (arr: VersionArray) => `${arr[0]}.${arr[1]}.${arr[2]}`;

export const isNewer = (versionX: VersionArray, versionY: VersionArray) => {
    const parsedX = parse(versionX);
    const parsedY = parse(versionY);

    if (parsedX.major - parsedY.major !== 0) {
        return parsedX.major > parsedY.major;
    }
    if (parsedX.minor - parsedY.minor !== 0) {
        return parsedX.minor > parsedY.minor;
    }
    if (parsedX.patch - parsedY.patch !== 0) {
        return parsedX.patch > parsedY.patch;
    }

    return false;
};

export const isEqual = (versionX: VersionArray, versionY: VersionArray) =>
    toString(versionX) === toString(versionY);

export const isNewerOrEqual = (versionX: VersionArray, versionY: VersionArray) =>
    isNewer(versionX, versionY) || isEqual(versionX, versionY);

export const convertOneKeyVersionToStatic = (device: TrezorDevice): VersionArray => {
    const INITIAL_VERSION: VersionArray = [1, 0, 0];
    if (!device || !device.features) return INITIAL_VERSION;
    const { features } = device;
    const trezorVersionArray: VersionArray = [
        features.major_version,
        features.minor_version,
        features.patch_version,
    ];
    if (!features.onekey_version) return trezorVersionArray;
    const onekeyVersionList = features.onekey_version
        .split('.')
        .slice(0, 3)
        .map((str, index) => {
            const converted = Number(str);
            if (Number.isNaN(converted)) {
                return INITIAL_VERSION[index];
            }
            return converted;
        });
    return onekeyVersionList as VersionArray;
};
