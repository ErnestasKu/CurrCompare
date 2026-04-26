ARG DOTNET_VERSION=8.0
ARG BUILD_CONFIGURATION=Release

FROM mcr.microsoft.com/dotnet/sdk:${DOTNET_VERSION} AS build

WORKDIR /src

COPY . .

RUN dotnet restore "server.csproj"
RUN dotnet build "server.csproj" -c "$BUILD_CONFIGURATION" -o /app/build

RUN dotnet publish "server.csproj" -c "$BUILD_CONFIGURATION" -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:$DOTNET_VERSION AS run
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:10000

ENTRYPOINT [ "dotnet", "server.dll" ]