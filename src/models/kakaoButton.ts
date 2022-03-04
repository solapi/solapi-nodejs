/**
 * @name "카카오 버튼타입"
 */
type KakaoButtonType = 'WL' | 'AL' | 'BK' | 'MD' | 'DS' | 'BC' | 'BT' | 'AC'

export type KakaoButton = {
    buttonName: string
    buttonType: KakaoButtonType
    linkMo?: string
    linkPc?: string
    linkAnd?: string
    linkIos?: string
}
