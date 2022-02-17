export type Count = {
    total: number,
    sentTotal: number,
    sentFailed: number,
    sentSuccess: number,
    sentPending: number,
    sentReplacement: number,
    refund: number,
    registeredFailed: number,
    registeredSuccess: number
}

type CountryChargeStatus = Map<string, number>

export type CountForCharge = {
    sms: CountryChargeStatus,
    lms: CountryChargeStatus,
    mms: CountryChargeStatus,
    ata: CountryChargeStatus,
    cta: CountryChargeStatus,
    cti: CountryChargeStatus,
    nsa: CountryChargeStatus,
    rcs_sms: CountryChargeStatus,
    rcs_lms: CountryChargeStatus,
    rcs_mms: CountryChargeStatus,
    rcs_tpl: CountryChargeStatus
}

export type CommonCashResponse = {
    requested: number,
    replacement: number,
    refund: number,
    sum: number
}

export type App = {
    profit: {
        sms: number,
        lms: number,
        mms: number,
        ata: number,
        cta: number,
        cti: number,
        nsa: number,
        rcs_sms: number,
        rcs_lms: number,
        rcs_mms: number,
        rcs_tpl: number
    },
    appId: string | null | undefined
}

export type Log = Array<object>

export type GroupId = string
