# Use a lightweight web server image
FROM nginx:alpine

# Set working directory
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy the HTML file into the container
COPY index.html ./

# Expose port 80
EXPOSE 80

# No CMD needed, nginx default is fine
