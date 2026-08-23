"use client";

import {
  useEffect,
  useRef,
} from "react";

import { Body } from "@/lib/physics/Body";
import { PhysicsEngine } from "@/lib/physics/PhysicsEngine";
import { Vector } from "@/lib/physics/Vector";

interface PhysicsCanvasProps {
  engine: PhysicsEngine;
  running: boolean;
  onBodyCountChange: (
    count: number
  ) => void;
}

export default function PhysicsCanvas({
  engine,
  running,
  onBodyCountChange,
}: PhysicsCanvasProps) {
  const canvasRef =
    useRef<HTMLCanvasElement>(null);

  const animationRef =
    useRef<number | null>(null);

  const lastTimeRef =
    useRef<number | null>(null);

  useEffect(() => {
    const canvas =
      canvasRef.current;

    if (!canvas) return;

    const context =
      canvas.getContext("2d");

    if (!context) return;

    const resize = () => {
      const rect =
        canvas.getBoundingClientRect();

      const ratio =
        window.devicePixelRatio || 1;

      canvas.width =
        rect.width * ratio;

      canvas.height =
        rect.height * ratio;

      context.setTransform(
        ratio,
        0,
        0,
        ratio,
        0,
        0
      );
    };

    resize();

    window.addEventListener(
      "resize",
      resize
    );

    const render = (
      timestamp: number
    ) => {
      const rect =
        canvas.getBoundingClientRect();

      if (
        lastTimeRef.current === null
      ) {
        lastTimeRef.current =
          timestamp;
      }

      let delta =
        (timestamp -
          lastTimeRef.current) /
        1000;

      lastTimeRef.current =
        timestamp;

      /*
       * Evita saltos enormes si la
       * pestaña estuvo inactiva.
       */
      delta = Math.min(
        delta,
        0.033
      );

      if (running) {
        engine.update(delta);
      }

      context.clearRect(
        0,
        0,
        rect.width,
        rect.height
      );

      drawGrid(
        context,
        rect.width,
        rect.height
      );

      for (const body of engine.bodies) {
        drawBody(
          context,
          body
        );
      }

      animationRef.current =
        requestAnimationFrame(
          render
        );
    };

    animationRef.current =
      requestAnimationFrame(
        render
      );

    return () => {
      window.removeEventListener(
        "resize",
        resize
      );

      if (
        animationRef.current !==
        null
      ) {
        cancelAnimationFrame(
          animationRef.current
        );
      }
    };
  }, [engine, running]);

  function drawGrid(
    context: CanvasRenderingContext2D,
    width: number,
    height: number
  ) {
    context.strokeStyle =
      "rgba(255,255,255,0.05)";

    context.lineWidth = 1;

    const size = 40;

    for (
      let x = 0;
      x < width;
      x += size
    ) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(
        x,
        height
      );
      context.stroke();
    }

    for (
      let y = 0;
      y < height;
      y += size
    ) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(
        width,
        y
      );
      context.stroke();
    }
  }

  function drawBody(
    context: CanvasRenderingContext2D,
    body: Body
  ) {
    const gradient =
      context.createRadialGradient(
        body.position.x - 5,
        body.position.y - 5,
        2,
        body.position.x,
        body.position.y,
        body.radius
      );

    gradient.addColorStop(
      0,
      "#ffffff"
    );

    gradient.addColorStop(
      0.25,
      "#60a5fa"
    );

    gradient.addColorStop(
      1,
      "#2563eb"
    );

    context.beginPath();

    context.arc(
      body.position.x,
      body.position.y,
      body.radius,
      0,
      Math.PI * 2
    );

    context.fillStyle =
      gradient;

    context.fill();

    context.strokeStyle =
      "rgba(255,255,255,0.5)";

    context.stroke();
  }

  function handlePointerDown(
    event: React.PointerEvent<HTMLCanvasElement>
  ) {
    const canvas =
      canvasRef.current;

    if (!canvas) return;

    const rect =
      canvas.getBoundingClientRect();

    const x =
      event.clientX -
      rect.left;

    const y =
      event.clientY -
      rect.top;

    const body = new Body(
      20,
      12,
      new Vector(x, y)
    );

    engine.addBody(body);

    onBodyCountChange(
      engine.bodies.length
    );
  }

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={
        handlePointerDown
      }
      className="h-[520px] w-full cursor-crosshair rounded-2xl border border-white/10 bg-black"
    />
  );
}