FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY *.csproj ./
RUN dotnet restore
ENV PATH="${PATH}:/root/.dotnet/tools"
RUN dotnet tool install --global dotnet-ef
COPY . ./
RUN dotnet ef database update
RUN dotnet publish -c Release -o /app



FROM mcr.microsoft.com/dotnet/sdk:9.0
WORKDIR /app
COPY --from=build /app ./
ENV PATH="${PATH}:/root/.dotnet/tools"
EXPOSE 8080
ENTRYPOINT ["dotnet", "backend.dll"]
