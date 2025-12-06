'use client'

export default function FloatingShapes() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* 浮动的3D立方体 */}
      <div className="absolute top-1/4 left-1/4 animate-float-slow">
        <div className="cube-container">
          <div className="cube">
            <div className="cube-face cube-front"></div>
            <div className="cube-face cube-back"></div>
            <div className="cube-face cube-right"></div>
            <div className="cube-face cube-left"></div>
            <div className="cube-face cube-top"></div>
            <div className="cube-face cube-bottom"></div>
          </div>
        </div>
      </div>

      {/* 浮动的3D球体 */}
      <div className="absolute top-1/3 right-1/4 animate-float-medium">
        <div className="sphere">
          <div className="sphere-glow"></div>
        </div>
      </div>

      {/* 浮动的3D金字塔 */}
      <div className="absolute bottom-1/4 left-1/3 animate-float-fast">
        <div className="pyramid-container">
          <div className="pyramid">
            <div className="pyramid-face pyramid-front"></div>
            <div className="pyramid-face pyramid-right"></div>
            <div className="pyramid-face pyramid-back"></div>
            <div className="pyramid-face pyramid-left"></div>
            <div className="pyramid-face pyramid-bottom"></div>
          </div>
        </div>
      </div>

      {/* 旋转的环形 */}
      <div className="absolute top-1/2 right-1/3 animate-spin-slow">
        <div className="ring"></div>
      </div>

      {/* 样式定义 */}
      <style jsx>{`
        /* 立方体 */
        .cube-container {
          perspective: 1000px;
          width: 100px;
          height: 100px;
        }
        
        .cube {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          animation: rotateCube 20s infinite linear;
        }
        
        .cube-face {
          position: absolute;
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, rgba(96, 165, 250, 0.3), rgba(139, 92, 246, 0.3));
          border: 2px solid rgba(96, 165, 250, 0.5);
          backdrop-filter: blur(10px);
        }
        
        .cube-front { transform: rotateY(0deg) translateZ(50px); }
        .cube-back { transform: rotateY(180deg) translateZ(50px); }
        .cube-right { transform: rotateY(90deg) translateZ(50px); }
        .cube-left { transform: rotateY(-90deg) translateZ(50px); }
        .cube-top { transform: rotateX(90deg) translateZ(50px); }
        .cube-bottom { transform: rotateX(-90deg) translateZ(50px); }

        /* 球体 */
        .sphere {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(236, 72, 153, 0.6), rgba(139, 92, 246, 0.3));
          box-shadow: 
            0 0 40px rgba(236, 72, 153, 0.4),
            inset -10px -10px 40px rgba(0, 0, 0, 0.3);
          animation: pulseSphere 3s ease-in-out infinite;
        }

        .sphere-glow {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3), transparent 60%);
        }

        /* 金字塔 */
        .pyramid-container {
          perspective: 1000px;
          width: 80px;
          height: 80px;
        }

        .pyramid {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          animation: rotatePyramid 15s infinite linear;
        }

        .pyramid-face {
          position: absolute;
          width: 0;
          height: 0;
          border-left: 40px solid transparent;
          border-right: 40px solid transparent;
          border-bottom: 80px solid rgba(16, 185, 129, 0.4);
          border-top: 0;
        }

        .pyramid-front { transform: rotateX(60deg) translateZ(20px); }
        .pyramid-right { transform: rotateY(90deg) rotateX(60deg) translateZ(20px); }
        .pyramid-back { transform: rotateY(180deg) rotateX(60deg) translateZ(20px); }
        .pyramid-left { transform: rotateY(-90deg) rotateX(60deg) translateZ(20px); }
        .pyramid-bottom { 
          width: 80px;
          height: 80px;
          background: rgba(16, 185, 129, 0.3);
          border: none;
          transform: translateZ(-40px);
        }

        /* 环形 */
        .ring {
          width: 150px;
          height: 150px;
          border: 8px solid rgba(245, 158, 11, 0.5);
          border-radius: 50%;
          box-shadow: 
            0 0 30px rgba(245, 158, 11, 0.3),
            inset 0 0 30px rgba(245, 158, 11, 0.2);
        }

        /* 动画 */
        @keyframes rotateCube {
          from { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
          to { transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg); }
        }

        @keyframes rotatePyramid {
          from { transform: rotateY(0deg) rotateX(20deg); }
          to { transform: rotateY(360deg) rotateX(20deg); }
        }

        @keyframes pulseSphere {
          0%, 100% { transform: scale(1); box-shadow: 0 0 40px rgba(236, 72, 153, 0.4); }
          50% { transform: scale(1.1); box-shadow: 0 0 60px rgba(236, 72, 153, 0.6); }
        }
      `}</style>
    </div>
  )
}

