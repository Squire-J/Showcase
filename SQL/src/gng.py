#!/usr/bin/env python3
import os
testing = False
import psycopg2
import datetime
Options_Mainpage = ['Quit Session','Reset DB','Run Saved SQL Queries','Manage Campaign','Accounting','View Member History', 'Annotations', 'Write your own Querie',]
cursor = dbconn.cursor()

#  ~~ Helper Methods ~~
def RunAtYourOwnRisk():
    try:
        if testing == False:
            os.system('clear')
        print('The following functionality is untested and may result in DB Overload')
        userInput = getUserInput('Do you want to continue?\t(y/n)')
        if str(userInput) == 'y':
            return True
        else:
            return False
    except:
        print('Invalid entry')
        RunAtYourOwnRisk()
            
def terminate():
    print('An error has occured. \n PROGRAM TERMINATED')
    cursor.close()
    dbconn.close()
    exit()

def FunctionNotAvailable():
    print('We are sorry. GNG is still implimenting this service. \nPlease check again at a later date')

def PrintQuerie():
    try:
        querieResults = cursor.fetchall()
        colomnNames = [i[0] for i in cursor.description]
        print('')
        if len(querieResults) == 0:
            print('\t\t<No Entries>\n')
        for entry in querieResults:
            i=0
            for attribute in entry:
                print('\t\t'+str(colomnNames[i])+':\t'+str(attribute))
                i=i+1
            print('')
    except:
        print('Error Printing Table')

def Sanatize(input, blacklist):
    input = str(input.lower())
    if testing:
        print('Tested input:\n\t'+input)
    for item in blacklist:
        if testing:
            print(item+': '+str(item in input))
        if item in input:
            if testing == False:
                os.system('clear')
            print('Malicious attack detected\nYou have been removed from the system')
            print('Entry '+item.upper()+' prohibited')
            terminate()

def getUserInput(ask):
    try:
        return input(str(ask)+'\n')
    except:
        print('Get user input FAILED\n~Terminating Program~')
        terminate()

def navToPath(path):
    try:
        if testing:
            print ('Current DIR:\t'+os.getcwd())
            print('Navigating to '+path+' DIR')
        os.chdir(path)
    except OSError:
        print('DIR not found')
        terminate()

def navToParent():
    try:
        if testing:
            print ('Current DIR:\t'+os.getcwd())
            print("Returning to home DIR")
        os.chdir('..')
    except:
        print('Something went wrong')
        terminate()

def runFileSQL(path, filename):
    if path != None:
        navToPath(path)

    try:
        file = open(filename, 'r')
        sql = ' '.join(file.readlines())
        if testing:
            print ("\tRunning: " + filename)
            print (sql)
        result = cursor.execute(sql)
    except:
        print('\tError running SQL File '+filename)
        if path != None:
            terminate()
        
    if path != None:
        navToParent()

def creatNewCampaign():
    try:
        Blacklist = ['--',';','delete','select','update','=','where','from','"','\'']
        CampaignName = str(getUserInput('~~~What is the name of your new campaign?~~~'))
        CampaignDuration = int(getUserInput('~~~What is the duration of '+CampaignName+' in days?~~~\n\tPLEASE ENTER A NUMBER'))
        CampaignWebsite = str(getUserInput('~~~Insert Website~~~'))
        CampaignBudget = int(getUserInput('~~~Starting Budget?~~~\n\tPLEASE ENTER A NUMBER'))

        cursor.execute("""SELECT CampaignName FROM Campaigns WHERE CampaignName = '%s'""" % str(CampaignName))
        if cursor.fetchone() != None:
            print('Campaign already exists')
            return CampaignName

        Sanatize(str(CampaignName), Blacklist)
        Sanatize(str(CampaignDuration), Blacklist)
        Sanatize(str(CampaignWebsite), Blacklist)
        Sanatize(str(CampaignBudget), Blacklist)
    except:
        print('Bad Data\nReturning to Main Page')
        return

    try:
        cursor.execute("""
            INSERT INTO Campaigns VALUES
            ('%s', DEFAULT, %d, DEFAULT,'%s', %d)
        """ % (str(CampaignName), int(CampaignDuration), str(CampaignWebsite), int(CampaignBudget)))
        print('SUCCESS')
    except:
        print('\tERROR saving new Campaign')
        return
    return CampaignName

def CreateNewMemberAnnotation():
    Blacklist = ['--',';','delete','select','update','=','where','from','"','\'']
    MemberName = str(getUserInput('~~~What is the name if your desired Member?~~~'))
    Annotation = str(getUserInput('~~~Insert annotation here~~~'))
    Sanatize(MemberName,Blacklist)
    Sanatize(Annotation,Blacklist)

    try:
        cursor.execute("""
                SELECT MemberName FROM Members WHERE MemberName = '%s'
                """ % str(MemberName))
        if cursor.fetchone() == None:
            print('No such Campaign exists\nYou will be returned to the Main Page\nSorry for the inconvenience')
            return
    except:
        print('Internal SQL FAIL')
        terminate()

    try:
        cursor.execute("""
            INSERT INTO MemberAnnotations VALUES
            (DEFAULT, '%s', '%s')
        """ % (str(MemberName), str(Annotation)))
        print('SUCCESS')
    except:
        print('\tERROR saving new Memeber Annotation')
        terminate()

def CreateNewCampaignAnnotation():
    Blacklist = ['--',';','delete','select','update','=','where','from','"','\'']
    CampaignName = str(getUserInput('~~~What is the name of the campaign you wish to annotate?~~~'))
    Annotation = str(getUserInput('~~~Insert annotation here~~~'))
    Sanatize(CampaignName,Blacklist)
    Sanatize(Annotation,Blacklist)

    try:
        cursor.execute("""
                SELECT CampaignName FROM Campaigns WHERE CampaignName = '%s'
                """ % str(CampaignName))
        if cursor.fetchone() == None:
            print('No such Campaign exists\nYou will be returned to the Main Page\nSorry for the inconvenience')
            return
    except:
        print('Internal SQL FAIL')
        terminate()

    try:
        cursor.execute("""
            INSERT INTO CampaignAnnotations VALUES
            (DEFAULT, '%s', '%s')
        """ % (str(CampaignName), str(Annotation)))
        print('SUCCESS')
    except:
        print('\tERROR saving new Campaign Annotation')
        terminate()
    
def AddEvent(selectedCampaignName):
    risk = RunAtYourOwnRisk()
    if risk == False:
        return
    Blacklist = ['--',';','delete','select','update','=','where','from','"','\'']

    EventName = str(getUserInput('~~~What is the name of the Event?~~~'))
    Location = str(getUserInput('~~~Location?~~~'))
    Date = str(getUserInput('~~~Date?~~~\n(0) - NOW'))
    if Date == str('NOW'):
        Date = datetime.datetime.now()

    try:
        result = cursor.execute("""SELECT PhaseName 
        FROM Phases 
        WHERE ParentCampaign = '%s'""" % str(selectedCampaignName))
        PrintQuerie()
    except:
        print('Internal SQL error')
        terminate()
    ParentPhase = str(getUserInput('~~~Which Phase does this belong to?~~~\n(0) - No phase'))
    if ParentPhase == str(0):
        return
    try:
        cursor.execute("""SELECT PhaseName 
        FROM Phases 
        WHERE ParentPhase = '%s'""" % str(ParentPhase))
        if cursor.fetchone() == None:
            print('That Phase does not exist in this campaign')
            return
    except:
        print('Internal SQL error')
        terminate()

    Sanatize(EventName,Blacklist)
    Sanatize(Location,Blacklist)
    Sanatize(Date,Blacklist)
    Sanatize(ParentPhase,Blacklist)

    try:
        cursor.execute("""INSERT INTO Events VALUES
        ('%s','%s','%s','%s')""" % (str(EventName), str(Location), str(Date), str(ParentPhase)))
    except:
        print('SQL Error')
        terminate()

def AddPhase(selectedCampaignName):
    Blacklist = ['--',';','delete','select','update','=','where','from','"','\'']
        
    PhaseName = str(getUserInput('~~~What is the name of the Phase?~~~'))
    Status = str(getUserInput('~~~Current Status?~~~'))

    Sanatize(PhaseName,Blacklist)
    Sanatize(Status,Blacklist)

    try:
        cursor.execute("""INSERT INTO Phases VALUES
        ('%s','%s','%s')""" % (str(PhaseName), str(Status), str(selectedCampaignName)))
    except:
        print('SQL Error')
        terminate()


def AddMemberToCampaign(selectedCampaignName):
    Blacklist = ['--',';','delete','select','update','=','where','from','"','\'']
    Participant = str(getUserInput('~~~What is the name of the new participant?~~~'))
    try:
        cursor.execute("""
                SELECT MemberName FROM Members WHERE MemberName = '%s'
                """ % str(Participant))
        if cursor.fetchone() == None:
            print('No such Member exists\nYou will be returned to the Manage Page\nSorry for the inconvenience')
            return
    except:
        print('Internal SQL FAIL')
        terminate()

    Sanatize(Participant,Blacklist)
    if testing:
        print(str(selectedCampaignName))
        print(str(Participant))
    try:
        cursor.execute("""
            INSERT INTO TakesPartIn VALUES
            ('%s','%s')
        """ % (str(Participant), str(selectedCampaignName)))
        print('SUCCESS')
    except:
        print('\tERROR Adding Member to Campaign')
        terminate()


def SeeStatus(selectedCampaignName):
    while True:
        if testing:
            print('Seeing status of: '+str(selectedCampaignName))
        print('(0) - Return')
        print('(1) - Phases Statuses')
        print('(2) - Understaffed Status')
        print('(3) - Staff')
        userInput = str(getUserInput('~~~What would you like to do?~~~'))
        if testing == False:
            os.system('clear')
        if (userInput) == str(0):
            return
        elif (userInput) == str(1):
            risk = RunAtYourOwnRisk()
            if risk == False:
                continue
            try:
                cursor.execute("""
                SELECT ParentCampaign, COUNT(Completed) AS COMPLETED, COUNT(InProgress) AS IN_PROGRESS, COUNT(Standby) AS Standby
                FROM
                ((SELECT ParentCampaign, COUNT(*) AS Completed
                FROM Phases
                WHERE Status = 'Completed'
                GROUP BY Phases.ParentCampaign
                ) AS Q1

                NATURAL RIGHT JOIN

                (SELECT ParentCampaign, COUNT(*) AS InProgress
                FROM Phases
                WHERE Status = 'In Progress'
                GROUP BY Phases.ParentCampaign
                ) AS Q2

                NATURAL LEFT JOIN

                (SELECT ParentCampaign, COUNT(*) AS Standby
                FROM Phases
                WHERE Status = 'Standby'
                GROUP BY Phases.ParentCampaign
                ) AS Q3

                )AS Q
                
                WHERE ParentCampaign = '%s'""" % str(selectedCampaignName))
                PrintQuerie()
            except:
                print('Internal SQL Error')
                terminate()
        elif (userInput) == str(2):
            risk = RunAtYourOwnRisk()
            if risk == False:
                continue
            try:
                cursor.execute("""
                SELECT Campaign, COUNT(Staff) AS CurrentStaff, SUM(3 * EventCounts.EventCounter) AS RequiredStaff
                FROM   (SELECT Campaign, COUNT(DISTINCT Participant) AS Staff
                    FROM TakesPartIn
                    GROUP BY Campaign) AS Workers,
                    (SELECT CampaignName, COUNT(DISTINCT EventName) AS EventCounter
                    FROM    (Campaigns JOIN Phases ON (CampaignName = ParentCampaign) JOIN EVENTS ON (PhaseName = ParentPhase)) AS Dockett
                    GROUP BY CampaignName) AS EventCounts
                WHERE Workers.Campaign = EventCounts.CampaignName AND Workers.Staff < (3 * EventCounts.EventCounter)
                GROUP BY Campaign
                WHERE Campaign = '%s'""" % str(selectedCampaignName))
                PrintQuerie()
            except:
                print('Internal SQL Error')
                terminate()
        elif (userInput) == str(3):
            try:
                cursor.execute("""
                SELECT Participant 
                FROM TakesPartIn 
                WHERE Campaign = '%s'""" % str(selectedCampaignName))
                PrintQuerie()
            except:
                print('Internal SQL Error')
                terminate()
        else:
            print('ID-10T Error\nPlease try again')


def ResetDB():
    print("Running operations to reset the database")
    runFileSQL('schemas', 'Members.sql')
    runFileSQL('schemas', 'Campaigns.sql')
    runFileSQL('schemas', 'Phases.sql')
    runFileSQL('schemas', 'Events.sql')
    runFileSQL('schemas', 'Donations.sql')
    runFileSQL('schemas', 'Payments.sql')
    runFileSQL('schemas', 'TakesPartIn.sql')
    runFileSQL('schemas', 'QuerieMetaData.sql')
    runFileSQL('schemas', 'MemberAnnotations.sql')
    runFileSQL('schemas', 'CampaignAnnotations.sql')
    os.system('pg_dump > sql/gng_dump.sql')
    
def ManageCampaign(selectedCampaignName):
    while True:
        print('(0) - Return to Main Page')
        print('(1) - Add Member to Campaign')
        print('(2) - Schedule Event')
        print('(3) - Set Phase')
        print('(4) - See Campaign status')

        userInput = getUserInput('~~~How would you like to manage this campaign?~~~')
        if testing == False:
            os.system('clear')
        if testing == False:
            os.system('clear')
        if str(userInput) == str(0):
            return
        elif str(userInput) == str(1):
            AddMemberToCampaign(selectedCampaignName)
        elif str(userInput) == str(2):
            AddEvent(selectedCampaignName)
        elif str(userInput) == str(3):
            AddPhase(selectedCampaignName)
        elif str(userInput) == str(4):
            SeeStatus(selectedCampaignName)
        else:
            print('ID-10T Error\nPlease try again')  

#  ~~ Pages ~~
def Page_ManageCampaign():
      
    if testing == False:
        os.system('clear')
    print("Managing Campaigns")
    selectedCampaign = None

    while True:
        print('(0) - return')
        print('(1) - Create new Campaign')
        print('Type campaign name for an already existing Campaign')
        userInput = getUserInput('~~~Which Campaign would you like to manage?~~~')
        if testing == False:
            os.system('clear')
        if str(userInput) == str(1):
            selectedCampaign = creatNewCampaign()
            ManageCampaign(str(selectedCampaign))
            break
        elif str(userInput) == str(0):
            return
        else:
            Blacklist = ['select','=','==','group','where','"','\'']
            Sanatize(userInput,Blacklist)
            try:
                cursor.execute("""
                    SELECT CampaignName
                    FROM Campaigns
                    WHERE CampaignName = '%s'
                """ % str(userInput))
                result = cursor.fetchone()
                if result == None:
                    print('Campaign Not Found')
                    continue
                selectedCampaign = result[0]
                ManageCampaign(selectedCampaign)
            except:
                print('Internal SQL Error')
                terminate()
            print('Youve selected campaign '+result[0])
            break

def Page_CustomCode():
    risk = RunAtYourOwnRisk()
    if risk == False:
        return
      
    print('\nCustom Code Page')
    code = getUserInput('Please write your SQL querie here\n')
    blacklist = ['donations', 'payments', 'delete', 'update']
    Sanatize(code,blacklist)
    if testing == False:
        os.system('clear')
    try:
        cursor.execute("""
        %s
        """ % str(code))
        PrintQuerie()
    except:
        print('SQL Error. Because this programs sucks and you may need to restart. Sorry')
    
def Page_Accounting():
    while True:
        print('(0) - return')
        print('(1) - See all transactions')
        print('(2) - See Transactions for a single Campaign')
        userInput = getUserInput('~~~What would you like to do?~~~')
        if testing == False:
            os.system('clear')
        if str(userInput) == str(0):
            return
        elif str(userInput) == str(1):
            try:
                cursor.execute("""
                    SELECT * FROM Donations
                    """)
                PrintQuerie()
                cursor.execute("""
                    SELECT * FROM Donations
                    """)
                PrintQuerie()
            except:
                print('Internal SQL Error')
                terminate()
        elif str(userInput) == str(2):
            userInput = getUserInput('~~~Which Campaign would you like to view?~~~')
            try:
                cursor.execute("""
                    SELECT * FROM Donations
                    WHERE Recipiant = '%s'
                    """ % str(userInput))
                PrintQuerie()
                cursor.execute("""
                    SELECT * FROM Payments
                    WHERE Sender = '%s'
                    """ % str(userInput))
                PrintQuerie()
            except:
                print('Internal SQL Error')
                terminate()
        else:
            print('ID-10T Error\nPlease try again')
      

def Page_MemberHistory():
    userInput = str(getUserInput('~~~Who would you like to querie?~~~'))
    try:
        print('\t~~Annotations~~:')
        cursor.execute(""" 
            SELECT Annotation 
            FROM MemberAnnotations 
            WHERE MemberName = '%s'
        """ % userInput)
        PrintQuerie()

        print('\n\t~~Worked Campaigns~~')
        cursor.execute(""" 
            SELECT Campaign 
            FROM TakesPartIn 
            WHERE Participant = '%s'
        """ % userInput)
        PrintQuerie()

        print('\n\t~~Donations~~')
        cursor.execute(""" 
            SELECT * 
            FROM Donations 
            WHERE Sender = '%s'
        """ % userInput)
        PrintQuerie()

        print('\n\t~~Payments~~')
        cursor.execute(""" 
            SELECT * 
            FROM Payments 
            WHERE Recipiant = '%s'
        """ % userInput)
        PrintQuerie()
    except:
        print('SQL Error')

def Page_Annotations():
    option_Read = None
    option_Write = None
    try:
        while option_Read == None:
            print('Annotations Page')
            print('(0) - Back to Main Page')
            print('(1) - View Annotations')
            print('(2) - Create an Annotation')

            userInput = getUserInput('~~~What would you like to do?~~~')
            if testing == False:
                os.system('clear')
            if str(userInput) == str(0):
                return
            elif str(userInput) == str(1):
                option_Read = True
                option_Members = None
                while option_Members == None:
                    print('Viewing annotations:')
                    print('(0) - Back to Main Page')
                    print('(1) - View Annotations about Members')
                    print('(2) - View Annotations about Campaigns')
                    userInput = getUserInput('~~~What would you like to do?~~~')
                    if testing == False:
                        os.system('clear')
                    if str(userInput) == str(0):
                        return
                    elif str(userInput) == str(1):
                        option_Members = True
                        userInput = getUserInput('~~~Which Member would you like to read up on?~~~')
                        if testing == False:
                            os.system('clear')
                        try:
                            cursor.execute("""
                            SELECT Annotation FROM MemberAnnotations WHERE MemberName = '%s'
                            """ % str(userInput))
                            PrintQuerie()
                        except:
                            print('SQL Error')
                    elif str(userInput) == str(2):
                        option_Members = False
                        userInput = getUserInput('~~~Which Campaign would you like to read up on?~~~')
                        if testing == False:
                            os.system('clear')
                        try:
                            cursor.execute("""
                            SELECT Annotation FROM CampaignAnnotations WHERE CampaignName = '%s'
                            """ % str(userInput))
                            PrintQuerie()
                        except:
                            print('SQL Error')
                    else:
                        print('Invalid Entry\nPlease try again')
            elif str(userInput) == str(2):
                option_Read = False
                option_Members = None
                while option_Members == None:
                    print('Creating an annotation:')
                    print('(0) - Back to Main Page')
                    print('(1) - Create Annotation for Members')
                    print('(2) - Create Annotations for Campaigns')
                    userInput = getUserInput('~~~What would you like to do?~~~')
                    if testing == False:
                        os.system('clear')
                    if str(userInput) == str(0):
                        return
                    elif str(userInput) == str(1):
                        option_Members = True
                        CreateNewMemberAnnotation()
                    elif str(userInput) == str(2):
                        option_Members = False
                        CreateNewCampaignAnnotation()
                    else:
                        print('Invalid Entry\nPlease try again')
            else:
                print('Invalid entry')
    except:
        print('ID-10T Error\nPlease try again')
        terminate()
        

def Page_SavedQ():
    if testing == False:
        os.system('clear')
    print('\nSAVED QUERIES PAGE')
    search = None
    try:
        search = cursor.execute("""
            SELECT *
            FROM QuerieMetaData
        """)
    except:
        print('\tERROR in retreiving saved Queries')
        return
    result = cursor.fetchall()

    while True:
        print('(0) - Return to previous page')
        for row in result:
            print ("(%s) - %s" % (row[0],row[1]))
        UserInput = getUserInput('\n~~ Which SQL Querie would you like to run? ~~\n')
        if str(UserInput) == str(0): 
            return
        else:
            try:
                if testing == False:
                    os.system('clear')
                print('You''ve selected querie \n\t'+result[int(UserInput)-1][1])
                runFileSQL('queries', result[int(UserInput)-1][2])
                PrintQuerie()
            except:
                print('ID-10T Error\nPlease Try Again')

def Page_Main():
    print('MAIN PAGE')

    while True:
        for option in Options_Mainpage:
            print('('+str(Options_Mainpage.index(option))+')\t'+option)
        UserInput = getUserInput('\n~~ How can we help you today? ~~\n')
        if testing == False:
            os.system('clear')
        
        if(str(UserInput) == str(0)):
            return
        elif(str(UserInput) == str(1)):
            ResetDB()
        elif(str(UserInput) == str(2)):
            Page_SavedQ()
        elif(str(UserInput) == str(3)):
            Page_ManageCampaign()
        elif(str(UserInput) == str(4)):
            Page_Accounting()
        elif(str(UserInput) == str(5)):
            Page_MemberHistory() 
        elif(str(UserInput) == str(6)):
            Page_Annotations()   
        elif(str(UserInput) == str(7)):
            Page_CustomCode()
        else:
            print('ID-10T ERROR\nPlease try again')

#  ~~ MAIN ~~
if __name__ == "__main__":
    ResetDB()
    if testing == False:
        os.system('clear')
    print('Welcome to the GNG TUI!')
    Page_Main()
    cursor.close()
    dbconn.close()
    print('Goodbye!')
