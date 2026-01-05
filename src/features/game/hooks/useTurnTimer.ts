import { useEffect, useRef,  useState } from "react";

type UseTurnTimerArgs = {
    seconds: number;
    onExpire: () => void;
};

export function useTurnTimer({ seconds, onExpire }: UseTurnTimerArgs) {
    const [remaining, setRemaining] = useState(seconds)
    const onExpireRef = useRef(onExpire)

    useEffect(() => {
        onExpireRef.current = onExpire
    }, [onExpire])

    useEffect(() => {
        const id = window.setInterval(() => {
            setRemaining((prev) => {
                if(prev <= 1){
                    window.clearInterval(id)
                    onExpireRef.current()
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => window.clearInterval(id)
    }, [remaining])

    return { remaining }
}