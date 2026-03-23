FROM kalilinux/kali-rolling

RUN apt-get update && apt-get install -y --no-install-recommends \
    nmap \
    nikto \
    gobuster \
    sqlmap \
    hydra \
    john \
    hashcat \
    metasploit-framework \
    dirb \
    enum4linux \
    net-tools \
    iputils-ping \
    dnsutils \
    curl \
    wget \
    python3 \
    python3-pip \
    wordlists \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace

CMD ["tail", "-f", "/dev/null"]
