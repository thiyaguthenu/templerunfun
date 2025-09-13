import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./index.css";

export default function TempleRunClone() {
  const canvasRef = useRef(null);
  const [player, setPlayer] = useState({ x: 100, y: 200, width: 40, height: 40 });
  const [obstacles, setObstacles] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    function spawnObstacle() {
      setObstacles(prev => [...prev, { x: 400, y: 220, width: 40, height: 40 }]);
    }

    const interval = setInterval(spawnObstacle, 2000);

    function gameLoop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#facc15";
      ctx.fillRect(player.x, player.y, player.width, player.height);

      setObstacles(prev =>
        prev.map(ob => ({ ...ob, x: ob.x - 5 })).filter(ob => ob.x + ob.width > 0)
      );

      obstacles.forEach(ob => {
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(ob.x, ob.y, ob.width, ob.height);
        if (
          player.x < ob.x + ob.width &&
          player.x + player.width > ob.x &&
          player.y < ob.y + ob.height &&
          player.y + player.height > ob.y
        ) {
          setGameOver(true);
          clearInterval(interval);
        }
      });

      setScore(prev => prev + 1);
      animationFrameId = requestAnimationFrame(gameLoop);
    }

    if (!gameOver) {
      animationFrameId = requestAnimationFrame(gameLoop);
    }

    return () => {
      clearInterval(interval);
      cancelAnimationFrame(animationFrameId);
    };
  }, [obstacles, player, gameOver]);

  function jump() {
    if (player.y === 200) {
      let jumpHeight = 0;
      const jumpInterval = setInterval(() => {
        jumpHeight += 5;
        if (jumpHeight < 50) {
          setPlayer(prev => ({ ...prev, y: prev.y - 5 }));
        } else if (jumpHeight < 100) {
          setPlayer(prev => ({ ...prev, y: prev.y + 5 }));
        } else {
          clearInterval(jumpInterval);
        }
      }, 20);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-2">Temple Run Clone</h1>
      <p className="mb-2">Score: {score}</p>
      {gameOver && <p className="text-red-400 text-lg">Game Over!</p>}
      <canvas ref={canvasRef} width={400} height={300} className="border-2 border-yellow-500 rounded-2xl bg-black" />
      <button onClick={jump} className="mt-4 bg-yellow-400 text-black px-4 py-2 rounded-xl shadow-lg hover:scale-105">
        Jump
      </button>
    </div>
  );
}
