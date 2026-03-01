# Stage 1: Builder
FROM rust:1.75 as builder
WORKDIR /app
COPY . .
RUN cargo build --release --workspace

# Stage 2: Runtime
FROM debian:bookworm-slim
WORKDIR /app
COPY --from=builder /app/target/release/national-library-core /usr/local/bin/
COPY --from=builder /app/src/knowledge/library /app/library_data

# Environment
ENV RUST_LOG=info
ENV LIBRARY_DB=/data/library.db

# Interface
ENTRYPOINT ["national-library-core"]
