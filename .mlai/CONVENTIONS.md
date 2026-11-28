# Conventions

## Guards (added after a mistake repeated)
- Before calling UI work done, render it in the browser at 390px and 1280px and check overflow, clipped text, overlap and contrast.
- Fix overflow, clipped text, overlap and low contrast that the browser check reports before calling UI work done.
- Before finishing, stop the servers and background commands you started; long-lived work goes in a job or the preview.
