export default function Welcome() {
  return (
    <div
      className="flex justify-center items-center gap-30 rounded h-[calc(100vh-170px)]"
      style={{ backgroundColor: 'var(--ant-color-bg-container)' }}
    >
      <div className="relative -bottom-10">
        <div className="text-[30px] leading-10.5 text-gray-800 dark:text-gray-200">
          欢迎体验
        </div>
        <div className="text-[40px] leading-15.5 text-[#ed6c00]">
          云程通用后台管理系统
        </div>
        <div className="text-center text-sm text-gray-500">
          React19+ReactRouter7+AntD6+TypeScript5+Vite实现云程通用后台
        </div>
      </div>
      <div className="w-92.5 h-80 ml-25 bg-[url('/imgs/welcome-bg.png')] bg-no-repeat bg-contain">
        <img src="/imgs/TaXi.png" />
      </div>
    </div>
  );
}
