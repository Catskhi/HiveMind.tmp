'use client'

import { toshibaSatFont, webplusFont } from "@/app/styles/font";
import { useEffect, useRef } from "react"

const ascii_characters = "░▒▓█▓▒░<>[]{}()/\\|!@#$%^&*-_=+"
const characters = 'アイウエオ0123456789<>[]{}()/\\|!@#$%^&*-_=+ΩΣΨΞДЖЙΛФ`';

export default function MatrixRain() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d')
        if (!ctx) return;

        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        const fontSize = 16;
        const columns = Math.floor(canvas.width / fontSize)
        const drops: number[] = Array(columns).fill(0);

        const draw = () => {
            ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            ctx.fillStyle = "rgba(192, 192, 192, 0.25)"
            ctx.font = `${fontSize}px ${toshibaSatFont.style.fontFamily}`

            for(let i = 0; i < drops.length; i++) {
                const text = characters.charAt(Math.floor(Math.random() * characters.length))
                const x_coord = i *fontSize
                const y_coord = drops[i] * fontSize
                ctx.fillText(text, x_coord, y_coord)

                if(drops[i]*fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0
                }
                drops[i]++
            }
        }

        const interval = setInterval(draw, 30)

        const handleResize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        window.addEventListener('resize', handleResize)

        return () => {
            clearInterval(interval)
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    return (
        <canvas ref={canvasRef} 
        className={ webplusFont.className + 
        " absolute top-0 left-0 w-full h-full -z-10"}>

        </canvas>
    )
}
