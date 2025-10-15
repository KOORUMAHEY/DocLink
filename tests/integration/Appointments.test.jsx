import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Appointments from '../../src/doctor/pages/Appointments'

// Mock the appointment service
jest.mock('../../src/features/appointments/services/appointmentService', () => ({
  getAppointmentsByDoctor: jest.fn(),
  rescheduleAppointment: jest.fn(),
  approveAppointment: jest.fn(),
  rejectAppointment: jest.fn(),
}))

jest.mock('../../src/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}))

describe('Appointments Component - Filtering', () => {
  const mockAppointments = [
    {
      id: '1',
      patientName: 'John Doe',
      patientEmail: 'john@example.com',
      appointmentDate: new Date(),
      status: 'pending',
      timeSlot: '10:00 AM',
    },
    {
      id: '2',
      patientName: 'Jane Smith',
      patientEmail: 'jane@example.com',
      appointmentDate: new Date(Date.now() + 86400000), // Tomorrow
      status: 'confirmed',
      timeSlot: '2:00 PM',
    },
    {
      id: '3',
      patientName: 'Bob Johnson',
      patientEmail: 'bob@example.com',
      appointmentDate: new Date(Date.now() + 7 * 86400000), // Next week
      status: 'completed',
      timeSlot: '11:00 AM',
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('filters appointments by status', async () => {
    const mockGetAppointments = require('../../src/features/appointments/services/appointmentService').getAppointmentsByDoctor
    mockGetAppointments.mockResolvedValue(mockAppointments)

    render(<Appointments doctorId="test-doctor" />)

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    // Initially should show all appointments
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument()

    // Filter by pending status
    const pendingButton = screen.getByRole('button', { name: /pending/i })
    await userEvent.click(pendingButton)

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()
      expect(screen.queryByText('Bob Johnson')).not.toBeInTheDocument()
    })

    // Filter by confirmed status
    const confirmedButton = screen.getByRole('button', { name: /confirmed/i })
    await userEvent.click(confirmedButton)

    await waitFor(() => {
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
      expect(screen.queryByText('Bob Johnson')).not.toBeInTheDocument()
    })
  })

  it('filters appointments by time period', async () => {
    const mockGetAppointments = require('../../src/features/appointments/services/appointmentService').getAppointmentsByDoctor
    mockGetAppointments.mockResolvedValue(mockAppointments)

    render(<Appointments doctorId="test-doctor" />)

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    // Filter by today
    const todayButton = screen.getByRole('button', { name: /today/i })
    await userEvent.click(todayButton)

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()
      expect(screen.queryByText('Bob Johnson')).not.toBeInTheDocument()
    })

    // Filter by all time
    const allTimeButton = screen.getByRole('button', { name: /all time/i })
    await userEvent.click(allTimeButton)

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument()
    })
  })

  it('searches appointments by patient name and email', async () => {
    const mockGetAppointments = require('../../src/features/appointments/services/appointmentService').getAppointmentsByDoctor
    mockGetAppointments.mockResolvedValue(mockAppointments)

    render(<Appointments doctorId="test-doctor" />)

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    // Search for "doe"
    const searchInput = screen.getByPlaceholderText(/search by patient name or email/i)
    await userEvent.type(searchInput, 'doe')

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()
      expect(screen.queryByText('Bob Johnson')).not.toBeInTheDocument()
    })

    // Search for email
    await userEvent.clear(searchInput)
    await userEvent.type(searchInput, 'jane@example.com')

    await waitFor(() => {
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
      expect(screen.queryByText('Bob Johnson')).not.toBeInTheDocument()
    })
  })
})