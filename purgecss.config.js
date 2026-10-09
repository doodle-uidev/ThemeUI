// purgecss.config.js
module.exports = {
    content: [
      './src/main/resources/templates/**/*.html', // Thymeleaf 템플릿 파일 경로
      './src/main/resources/templates/**/*.th.xml', // Thymeleaf Layout Dialect 사용 시
      './src/main/resources/static/js/**/*.js',   // JavaScript 파일에서 동적으로 클래스 사용하는 경우
      // Storybook 관련 파일은 분석 대상에서 제외 (이미 output.css에 반영됨)
    ],
    css: ['./src/main/resources/static/css/common/output.css'], // Storybook output CSS 경로
    output: './src/main/resources/static/css/common/optimized.css', // 최적화된 CSS 출력 경로
    safelist: [], // 제거하면 안 되는 CSS 선택자 (필요에 따라 추가)
    // 필요에 따라 다른 PurgeCSS 옵션 추가
  };