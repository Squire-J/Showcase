#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <pthread.h>
#include <time.h>

struct timespec startTime;
int testing = 0;
int start = 0;// DONT CHANGE ME
int loadedTrains = 0;
#define BILLION 1000000000.0;

static int const PUSH = 1;
static int const POP = 2;
static int const PEAK = 3;

static int const INCREMENT = 1;
static int const DECREMENT = 0;

static int const FIRST = 1;
static int const SECOND = 0;

static int const EAST_LOW = 1;
static int const EAST_HIGH = 2;
static int const WEST_LOW = 3;
static int const WEST_HIGH = 4;

static int const MAX_ARR_SIZE = 50000;
static char* filename = "test.txt";

pthread_mutex_t W_manifestLock;
pthread_mutex_t E_manifestLock;
pthread_mutex_t w_manifestLock;
pthread_mutex_t e_manifestLock;
pthread_mutex_t countLock;
pthread_mutex_t waitLock;
pthread_cond_t waitStartCondition;

struct train{
    int number;
    float crossingTime;
    float loadingTime;
    char *direction;
    int threadNumber;
    struct train *next;
} W_manifest, w_manifest, E_manifest, e_manifest;

double gettime(){
    struct timespec stop;
    double time;
    if( clock_gettime( CLOCK_REALTIME, &stop) == -1 ) {
      perror( "clock gettime" );
      exit( EXIT_FAILURE );
    }

    time = ( stop.tv_sec - startTime.tv_sec )
          + ( stop.tv_nsec - startTime.tv_nsec )
            / BILLION;
    int hours = time/(60*60);
    time = time - (hours*(60*60));
    int minutes = time/60;
    time = time - (minutes * 60);
    float seconds = time;

    printf("%02d:%02d:%04.1f ", hours, minutes, seconds);
}

void changeTrainCount(int action){
    pthread_mutex_lock(&countLock);
    if(action == INCREMENT){
        loadedTrains++;
        if(testing) printf("\nIncrementing train count to %d\n",loadedTrains);
    }
    else if(action == DECREMENT){
        loadedTrains--;
        if(testing) printf("\nDecrementing train count to %d\n",loadedTrains);
    }
    else {
        printf("Invalid action while changing the train count\n");
        exit(0);
    }
    pthread_mutex_unlock(&countLock);
}

int compareTrains(struct train *A, struct train *B){
	if(testing)printf("Comparing trains %d and %d\n", A->number, B->number);
	if(A == NULL && B == NULL) {
		printf("ERROR: attempted to compare two NULL Trains\n");
		exit(0);
	}
	if(A != NULL && B == NULL) return FIRST;
	if(A == NULL && B != NULL) return SECOND;
        if(A->loadingTime == B->loadingTime){
	        if(A->number < B->number) return FIRST;
	        else return SECOND;
	}
	if(A->loadingTime < B->loadingTime) return FIRST;
	else return SECOND;
}

void pushStationManifest(struct train* newTrain, struct train* manifest){
    if (manifest == NULL){
        manifest = newTrain;
	    if(testing)printf("Adding to empty list\n");
    }
    else if(compareTrains(newTrain,manifest)){
        newTrain -> next = manifest;
        manifest = newTrain;
	if(testing)printf("Adding to the head of the list\n");
    }
    else{
	int location = 0;
        struct train *navNode = manifest;
        while((navNode -> next != NULL) && (compareTrains(newTrain,navNode->next) != 1)) {
            navNode = navNode->next;
            location++;
        }
        if(testing)printf("Adding train in spot %d\n", location);
        newTrain -> next = navNode->next;
        navNode -> next = newTrain;
    }
    if(manifest == NULL){
    	printf("ERROR: Train not added to manifest resulting in a null head\n");
	    exit(0);
    }
    if(testing){
	printf("TOP\n");
    	struct train *printNode = manifest->next;
        while(printNode != NULL){
            printf("Train %d\n\tCrossing time: %f\n\tLoading Time: %f\n\tDirection: %s\n",printNode->number, printNode->crossingTime, printNode->loadingTime, printNode->direction);
            printNode = printNode -> next;
        }
	printf("BOTTOM\n");
    }
    changeTrainCount(INCREMENT);
}

void popManifest(struct train* manifest){
	if(testing){
		printf("Popping train %d\n", manifest->next->number);
	}
	if(manifest->next==NULL)return;
	manifest -> next = manifest->next->next;
    	struct train *printNode = manifest->next;

	if(testing){
		printf("TOP\n");
        	while(printNode != NULL){
            		printf("Train %d\n\tCrossing time: %f\n\tLoading Time: %f\n\tDirection: %s\n",printNode->number, printNode->crossingTime, printNode->loadingTime, printNode->direction);
            		printNode = printNode -> next;
        	}
		printf("BOTTOM\n");
	}
	changeTrainCount(DECREMENT);
}

struct train * peakManifest(struct train* manifest){
	if(manifest->next == NULL)return NULL;
	if(testing){
		printf("Peaking train %d\n",manifest->next->number);
	}
	return manifest->next;
}

struct train * westboundStationHigh(int action, struct train *activeTrain){
	struct train* returnTrain;
	returnTrain = NULL;

	if(action == PUSH){
		if(testing) printf("Adding train %d to manifest W\n", activeTrain->number);
		pushStationManifest(activeTrain, &W_manifest);
	}
	else if(action == POP){
		if(testing)printf("Popping train from manifest W\n");
		popManifest(&W_manifest);
	}
	else if(action == PEAK){
		if(testing)printf("Peaking manifest W\n");
		returnTrain = peakManifest(&W_manifest);
	}
	return returnTrain;
}

struct train * eastboundStationHigh(int action, struct train *activeTrain){
	struct train* returnTrain;
	returnTrain = NULL;

	if(action == PUSH){
		if(testing)printf("Adding train %d to manifest E\n", activeTrain->number);
		pushStationManifest(activeTrain, &E_manifest);
	}
	else if(action == POP){
		if(testing)printf("Popping train from manifest E\n");
		popManifest(&E_manifest);
	}
	else if(action == PEAK){
		if(testing)printf("Peaking manifest E\n");
		returnTrain = peakManifest(&E_manifest);
	}
	return returnTrain;
}

struct train * westboundStationLow(int action, struct train *activeTrain){
	struct train* returnTrain;
	returnTrain = NULL;

	if(action == PUSH){
		if(testing) printf("Adding train %d to manifest w\n", activeTrain->number);
		pushStationManifest(activeTrain, &w_manifest);
	}
	else if(action == POP){
		if(testing)printf("Popping train from manifest w\n");
		popManifest(&w_manifest);
	}
	else if(action == PEAK){
		if(testing)printf("Peaking manifest w\n");
		returnTrain = peakManifest(&w_manifest);
	}
	return returnTrain;
}

struct train * eastboundStationLow(int action, struct train *activeTrain){
	struct train* returnTrain;
	returnTrain = NULL;

	if(action == PUSH){
		if(testing) printf("Adding train %d to manifest e\n", activeTrain->number);
		pushStationManifest(activeTrain, &e_manifest);
	}
	else if(action == POP){
		if(testing)printf("Popping train from manifest e\n");
		popManifest(&e_manifest);
	}
	else if(action == PEAK){
		if(testing)printf("Peaking manifest e\n");
		returnTrain = peakManifest(&e_manifest);
	}
	return returnTrain;
}

int chooseTrain(int A, int B, int C, int D, int step, struct train * e, struct train * E, struct train * w, struct train * W){
    if(step > 3) {
        printf("ERROR: Something went wrong in chosing a train\n");
        exit(0);
    }
    int action;
    if (step == 0) action = A;
    else if (step == 1) action = B;
    else if (step == 2) action = C;
    else action = D;

    struct train *activeNode = NULL;
    if(action == EAST_LOW) activeNode = eastboundStationLow(PEAK, NULL);
    else if(action == EAST_HIGH) activeNode = eastboundStationHigh(PEAK, NULL);
    else if(action == WEST_LOW) activeNode = westboundStationLow(PEAK, NULL);
    else activeNode = westboundStationHigh(PEAK, NULL);

    if(activeNode == NULL) action = chooseTrain(A,B,C,D,step+1,e,E,w,W);
    return action;
}


void mainTrack(int trainCount){
    int concurrentEast = 0;
    int concurrentWest = 0;
    int crossedTrains = 0;
    int finishingTime[trainCount];
    while(crossedTrains < trainCount){
        while(loadedTrains != 0){
            //signal maintrack is searching
            pthread_mutex_lock(&W_manifestLock);
            pthread_mutex_lock(&w_manifestLock);
            pthread_mutex_lock(&E_manifestLock);
            pthread_mutex_lock(&e_manifestLock);

            struct train * activeTrain = NULL;
            struct train * e = eastboundStationLow(PEAK,NULL);
            struct train * E = eastboundStationHigh(PEAK,NULL);
            struct train * w = westboundStationLow(PEAK,NULL);
            struct train * W = westboundStationHigh(PEAK,NULL);

            int action;
            if((concurrentEast == 0) && (concurrentWest == 0)) action = chooseTrain(EAST_HIGH,WEST_HIGH,EAST_LOW,WEST_LOW,0,e,E,w,W);
            else if(concurrentEast >= 3)action = chooseTrain(WEST_HIGH,WEST_LOW,EAST_HIGH,EAST_LOW,0,e,E,w,W);
            else if(concurrentWest >= 3)action = chooseTrain(EAST_HIGH,EAST_LOW,WEST_HIGH,WEST_LOW,0,e,E,w,W); 
            else if(concurrentEast > concurrentWest) action = chooseTrain(WEST_HIGH,EAST_HIGH,WEST_LOW,EAST_LOW,0,e,E,w,W);
            else action = chooseTrain(EAST_HIGH,WEST_HIGH,EAST_LOW,WEST_LOW,0,e,E,w,W); 

            if(action == EAST_LOW) {
                activeTrain = e;
                eastboundStationLow(POP, NULL);
                concurrentEast++;
                concurrentWest = 0;
            }
            else if(action == EAST_HIGH) {
                activeTrain = E;
                eastboundStationHigh(POP, NULL);
                concurrentEast++;
                concurrentWest = 0;
            }
            else if(action == WEST_LOW) {
                activeTrain = w;
                westboundStationLow(POP, NULL);
                concurrentEast = 0;
                concurrentWest++;
            }
            else {
                activeTrain = W;
                westboundStationHigh(POP, NULL);
                concurrentEast = 0;
                concurrentWest++;
            }
            //signal maintrack is no longer searching
            pthread_mutex_unlock(&W_manifestLock);
            pthread_mutex_unlock(&w_manifestLock);
            pthread_mutex_unlock(&E_manifestLock);
            pthread_mutex_unlock(&e_manifestLock);

            if(testing) printf("Running train %d accross the main track for %f seconds\n", activeTrain->number, (activeTrain->crossingTime)/10);
            if(testing)printf("~~*~~");
            gettime();
            printf("Train %2d is ON the main track going %4s\n",activeTrain->number,activeTrain->direction);
            usleep((activeTrain -> crossingTime)*100000);
            if(testing)printf("~~*~~");
            gettime();
            printf("Train %2d is OFF the main track after going %4s\n",activeTrain->number,activeTrain->direction);
            free(activeTrain);
	        crossedTrains++;
        }
    }
}


void *loadTrains(void *train){
    struct train *workingTrain = train;
    int trainNumber = workingTrain->number;
    float loadingTime = workingTrain->loadingTime;
    char *direction = workingTrain->direction;


    if(testing)printf("\nWaiting loading for train %d\n",workingTrain->number);
    
    pthread_cond_wait(&waitStartCondition,&waitLock);
    pthread_mutex_unlock(&waitLock);

    if(testing)printf("\tLoading train %d for %f seconds\n",trainNumber,loadingTime/10);

    usleep(loadingTime*100000);
    if(testing) printf("Train %d has been loaded\n", trainNumber);


    if(strcmp(direction, "e") == 0) {
        workingTrain -> direction = "East";
        if(testing)printf("~~*~~");
        gettime();
        printf("Train %2d is ready to go %4s\n",trainNumber,workingTrain -> direction);

        pthread_mutex_lock(&e_manifestLock);
        eastboundStationLow(PUSH, workingTrain);
        pthread_mutex_unlock(&e_manifestLock);
    }
    else if(strcmp(direction, "E") == 0) {
        workingTrain -> direction = "East";
        if(testing)printf("~~*~~");
        gettime();
        printf("Train %2d is ready to go %4s\n",trainNumber,workingTrain -> direction);

        pthread_mutex_lock(&E_manifestLock);
        eastboundStationHigh(PUSH, workingTrain);
        pthread_mutex_unlock(&E_manifestLock);
    }
    else if(strcmp(direction, "w") == 0) {
        workingTrain -> direction = "West";
        if(testing)printf("~~*~~");
        gettime();
        printf("Train %2d is ready to go %4s\n",trainNumber,workingTrain -> direction);

        pthread_mutex_lock(&w_manifestLock);
        westboundStationLow(PUSH, workingTrain);
        pthread_mutex_unlock(&w_manifestLock);
    }
    else if(strcmp(direction, "W") == 0) {
        workingTrain -> direction = "West";
        if(testing)printf("~~*~~");
        gettime();
        printf("Train %2d is ready to go %4s\n",trainNumber,workingTrain -> direction);

        pthread_mutex_lock(&W_manifestLock);
        westboundStationHigh(PUSH, workingTrain);
        pthread_mutex_unlock(&W_manifestLock);
    }
    else {
        printf("ERROR: Train direction not specified\n"); 
        exit(0);
    }

    pthread_exit(NULL);
}

int main(){
    FILE * docket;
    docket = fopen(filename,"r");
    int trainNumber = 0;
    struct train *trains[MAX_ARR_SIZE];

    if((pthread_mutex_init(&waitLock,NULL) || pthread_mutex_init(&W_manifestLock,NULL) || pthread_mutex_init(&E_manifestLock,NULL) || pthread_mutex_init(&w_manifestLock,NULL) || pthread_mutex_init(&e_manifestLock,NULL) ) != 0) {
	    printf("\nMutex init failed\n");
	    exit(0);
    }

    if(docket == NULL){
        printf("No input file found");
        exit(0);
    }else{
	if(testing)printf("Parsing tokens\n");

	char dir[1];
	float loadingtime, crossingtime;
        while(fscanf(docket, "%s %f %f\n", dir, &loadingtime, &crossingtime) != EOF ){
	    if(testing) printf("%s %f %f\n", dir, loadingtime, crossingtime);
            struct train *newTrain;
	    newTrain = (struct train*)malloc(sizeof(struct train));

	    if(dir[0] == 'e') newTrain->direction = "e";
	    else if (dir[0] == 'E') newTrain->direction = "E";
 	    else if (dir[0] == 'w') newTrain->direction = "w";
            else if (dir[0] == 'W') newTrain->direction = "W";

            newTrain -> number = trainNumber;
            newTrain -> crossingTime = crossingtime;
            newTrain -> loadingTime = loadingtime;
	    newTrain -> threadNumber = -1;
	    trains[trainNumber] = newTrain;
	    trainNumber++;
        }
    	fclose(docket);	 
    }
    if (testing){
        printf("Checking correctness of parsing\n");
        for (int i = 0; i < trainNumber; i++){
            printf("Train Number: %d\n", trains[i]->number);
            printf("\tDirection: %s\n", trains[i]->direction);
            printf("\tLoading time: %f\n", trains[i]->loadingTime);
            printf("\tCrossing time: %f\n",trains[i]->crossingTime);
        }
    }

    long threadIDs[trainNumber];
    for (int i = 0; i < trainNumber; i++){
        threadIDs[i] = i;
        if(testing)printf("Creating thread %d\n", i);
        trains[i]->threadNumber=threadIDs[i];
        int threadStatus = pthread_create(&threadIDs[i], NULL, loadTrains, (void *)trains[i]);
        if (threadStatus){
            printf("ERROR; return code from pthread_create() is %d\n", threadStatus);
            exit(-1);
        }
    }
    if(testing){
        char dummy[MAX_ARR_SIZE];
        printf("Ready? (Please enter a non-empty string to start the program)\n");
        scanf("%s",dummy);
    } else{
    	usleep(1);
    } 
    
    if( clock_gettime( CLOCK_REALTIME, &startTime) == -1 ) {
      perror( "clock gettime" );
      exit( EXIT_FAILURE );
    }
    pthread_cond_broadcast(&waitStartCondition);

    mainTrack(trainNumber);
    if(testing)printf("Main Thread is finished\n");
    pthread_exit(NULL);
    exit(1);
}
