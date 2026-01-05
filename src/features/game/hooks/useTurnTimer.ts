import { useEffect, useRef,  useState } from "react";

type UseTurnTimerArgs = {
    seconds: number;
    onExpire: () => void;
};

export function useTurnTimer({ seconds, onExpire }: UseTurnTimerArgs) {
    const [remaining, setRemaining] = useState(seconds)
    const onExpireRef = useRef(onExpire)
    const expiredRef = useRef(false)

    useEffect(() => {
        onExpireRef.current = onExpire
    }, [onExpire])

    useEffect(() => {
        const id = window.setInterval(() => {
            setRemaining((prev) => Math.max(prev - 1, 0))
        }, 1000)

        return () => window.clearInterval(id)
    }, [])

    useEffect(() => {
        if(remaining !== 0) return
        if(expiredRef.current) return

        expiredRef.current = true
        onExpireRef.current();
    }, [remaining])

    return { remaining }
}