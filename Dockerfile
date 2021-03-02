FROM debian:stretch
MAINTAINER flo.kircher@gmail.com

RUN apt-get -qq update \
	&& DEBIAN_FRONTEND=noninteractive apt-get -qq install -y --no-install-recommends curl gnupg2 golang-go libstdc++6 rsync openssh-client git ca-certificates asciidoc \
	&& rm -rf /var/lib/apt/lists/*

# NodeJS (safe version: 8)
ENV NODEJS_VERSION 12

# Hugo (safe version: 0.49.2 -> 0.72.0 doesnt work)
ENV HUGO_VERSION 0.49.2
ENV HUGO_BINARY hugo_extended_${HUGO_VERSION}_Linux-64bit.deb

# Install nodejs
RUN curl -sL https://deb.nodesource.com/setup_${NODEJS_VERSION}.x | bash
RUN apt-get install -y nodejs

# Install nodejs modules
RUN npm install -g postcss-cli postcss autoprefixer

# Install & run Hugo
ADD https://github.com/spf13/hugo/releases/download/v${HUGO_VERSION}/${HUGO_BINARY} /tmp/hugo.deb
RUN dpkg -i /tmp/hugo.deb \
	&& rm /tmp/hugo.deb

WORKDIR /src

EXPOSE 1313
