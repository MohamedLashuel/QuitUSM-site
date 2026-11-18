# Design Guidelines

- Use design tokens wherever possible

- Colors should be in OKLCH

- When deciding how much spacing to give an element, err on the side of more

- Use the following pixel values for spacing and sizing:
	- 4px (16 / 4)
	- 8px (16 / 2)
	- 12px (16 * 3/4)
	- 16px (16 * 1)
	- 24px (16 * 1.5)
	- 32px (16 * 2)
	- 48px (16 * 3)
	- 64px (16 * 4)
	- 96px (16 * 6)
	- 128px (16 * 8)
	- 192px (16 * 12)
	- 256px (16 * 16)
	- 384px (16 * 24)
	- 512px (16 * 32)
	- 640px (16 * 40)
	- 768px (16 * 48)

- Use the following pixel values for font sizing:
	- 12px
	- 14px
	- 16px 
	- 18px
	- 20px
	- 24px
	- 30px
	- 36px
	- 48px
	- 60px
	- 72px

# Coding Guidelines

- Use eleventy as the build system

- Use TypeScript rather than JavaScript

- Try not to repeat code or functionality (DRY principle). If multiple elements should be styled the same way, use HTML classes

- Take a functional approach. Functions should be small and do only one thing

- Code should be clear and concise, without compromising on accuracy

- The site should be static HTML/CSS/JS without using any framework like React. If you actually need advanced functionality, use jQuery

- Don't use browser cookies unless you absolutely have to

- Follow accessibility best practices

- Make sure to run through the website to confirm everything works. Any complicated JS systems should also have tests written