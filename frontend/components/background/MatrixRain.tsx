'use client'

import { toshibaSatFont, webplusFont } from "@/app/styles/font";
import { useEffect, useRef } from "react"

const characters = 'アイウエオ0123456789<>[]{}()/\\|!@#$%^&*-_=+ΩΣΨΞДЖЙΛФ`';

export default function MatrixRain() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const columnsRef = useRef<number>(0)
    const dropsRef = useRef<number[]>([])
    const fontSize = 16

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d')
        if (!ctx) return;

        const initializeCanvas = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            columnsRef.current = Math.floor(canvas.width / fontSize)
            dropsRef.current = Array(columnsRef.current).fill(0)
        }

        initializeCanvas()

        const draw = () => {
            if (!canvas || !ctx) return

            ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            ctx.fillStyle = "rgba(192, 192, 192, 0.25)"
            ctx.font = `${fontSize}px ${toshibaSatFont.style.fontFamily}`

            for (let i = 0; i < dropsRef.current.length; i++) {
                const text = characters.charAt(Math.floor(Math.random() * characters.length))
                const x = i * fontSize
                const y = dropsRef.current[i] * fontSize

                ctx.fillText(text, x, y)
                if (y > canvas.height && Math.random() > 0.975) {
                    dropsRef.current[i] = 0
                }
                dropsRef.current[i]++
            }
        }

        const interval = setInterval(draw, 30)

        const handleResize = () => {
            if (!canvas) return
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            columnsRef.current = Math.floor(canvas.width / fontSize)
            dropsRef.current = Array(columnsRef.current).fill(0)
        }

        window.addEventListener('resize', handleResize)
        return () => {
            clearInterval(interval)
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    return (
        <canvas ref={canvasRef} 
                className={`${webplusFont.className} absolute top-0 left-0 w-full h-full -z-10`}
        />
    )
}