# INFO910 - Introduction DevOps

TP réaliser par Lohan Hébert et Lenny Loy.

# Notre application

Notre projet contient une API Node.js/Express et une base de données PostgreSQL permetant la gestion d'utilisateurs. 

L'api possède 3 endpoints :
- Pour s'assurer que l'api fonctionne <br>
Méthode : `GET`<br>
URL : `<URL_API>/`<br>

- Pour récuperer la liste des utilisateurs <br>
Méthode : `GET`<br>
URL : `<URL_API>/users`<br>


- Pour ajouter un utilisateur <br>
Méthode : `POST` <br>
URL : `<URL_API>/addUser` <br>
Header : `Content-Type: application/json` <br>
Body : `raw` puis `JSON` <br>

```json
{
  "id": 1,
  "name": "Alice",
  "username": "alice"
}
```

# Déployement

### Prérequis
- Docker Desktop
- Minikube
- Kubectl
- Postman, uniquement pour tester l'API


## Lancer le projet avec Minikube

### 1. Démarrer le cluster

```powershell
minikube start --driver=docker
minikube status
kubectl get nodes
kubectl cluster-info
```

Le nœud Minikube doit être dans l'état `Ready`.

### 2. Construire l'image de l'API dans Minikube

Le Deployment utilise l'image locale `mon-api-node:latest` et
`imagePullPolicy: Never`. L'image doit donc être disponible dans Minikube.

```powershell
minikube image build -t mon-api-node:latest .
minikube image ls | Select-String "mon-api-node"
```

### 3. Appliquer la configuration

```powershell
kubectl apply -f .\k8s\config.yaml
kubectl get configmap app-config
kubectl get secret app-secret
```

### 4. Créer le stockage PostgreSQL

```powershell
kubectl apply -f .\k8s\postgres-pvc.yaml
kubectl get pvc
```

Le PVC `postgres-pvc` doit passer à l'état `Bound`. Pour suivre son état :

```powershell
kubectl get pvc postgres-pvc --watch
```


### 5. Déployer PostgreSQL

```powershell
kubectl apply -f .\k8s\postgres.yaml
kubectl get pods
kubectl get service
kubectl get endpoints bd
```

Attendre que le Pod PostgreSQL soit `Running` et `Ready` :

```powershell
kubectl get pods --watch
```

### 6. Déployer l'API

```powershell
kubectl apply -f .\k8s\app.yaml
kubectl get deployment
kubectl get pods
```

Attendre que le Pod API soit `Running` et `Ready` :

```powershell
kubectl get pods --watch
```

Consulter les logs pour voir le message indiquant que le serveur Node.js a démarré `"Serveur démarré sur http://localhost:3000"` :

```powershell
kubectl logs deployment/api-deployment
```

## Accéder à l'API

Dans un terminal séparé, lancer :

```powershell
minikube service api-service
```

Minikube démarre un tunnel et affiche l'URL sur laquelle l'API est accessible

```text
http://127.0.0.1:xxxxx
```

Garder ce terminal ouvert pendant les tests. Le numéro de port peut changer
à chaque lancement du tunnel.