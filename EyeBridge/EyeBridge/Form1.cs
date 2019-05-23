using Tobii.Interaction;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using Tobii.Interaction.Framework;
using NamedPipeWrapper;
using SimpleTCP;

namespace EyeBridge
{
    public partial class Form1 : Form
    {
        private Host eyehost;
        private GazePointDataStream gazeData;
        private SimpleTcpClient client;
        private int port = 6969;
        private String host = "127.0.0.1";

        public Form1()
        {
            InitializeComponent();

            //Create Web Client
            client = new SimpleTcpClient().Connect(host, port);
            client.DataReceived += Data_Received;
            

        }

        private void Data_Received(object sender, SimpleTCP.Message e)
        {
            switch (e.MessageString)
            {
                case "CALIBRATE":
                    eyehost.Context.LaunchConfigurationTool(ConfigurationTool.GuestCalibration, (data) => { });
                    break;
                case "STARTSTREAM":
                    startDataStream();
                    break;
                case "STOPSTREAM":
                    stopDataStream();
                    break;
                default:
                    break;
            }
        }


        private void startDataStream()
        {
            eyehost = new Host();
            
            gazeData = eyehost.Streams.CreateGazePointDataStream();
            gazeData.GazePoint((gazePointX, gazePointY, _) => sendData((int)gazePointX, (int)gazePointY));
        }


        private void sendData(int X, int Y)
        {
            client.WriteLine(X+":"+Y+":");
        }

        private void stopDataStream()
        {
            eyehost.Dispose();
            
        }
       

        private void button1_Click(object sender, EventArgs e)
        {
            startDataStream();
        }

        private void button2_Click(object sender, EventArgs e)
        {
            stopDataStream();
        }

        private void button3_Click(object sender, EventArgs e)
        {
            Console.WriteLine();


        }
        private void Form1_Load(object sender, EventArgs e)
        {

        }
    }
}
